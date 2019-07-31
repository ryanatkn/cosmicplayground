import {compile, walk} from 'svelte/compiler';
import {Node} from 'svelte/types/compiler/interfaces';
import {RawSourceMap, SourceNode} from 'source-map';
import * as ts from 'typescript';

import {Logger} from '../logger';

// TODO maybe submit an upstream type def for easier usage
type CompilationVars = ReturnType<typeof compile>['vars'];

/*

TODO features

- see all of the unhandled node types in the `walk` call below
- `context="module"` needs better support - currently module scope can reference instance scope stuff
	- imports are the biggest hurdle, preventing the simple solution of just putting instance stuff in a nested function scope
		- maybe just hoist all imports?
- actions, transitions, animations, etc
- assert string/number/boolean/etc depending on how expressions are used in the code
- assert `{length: number}` interface for `#each` expression results
- types for callbacks
- `#await` blocks
- `let` directives - road is paved with child components being in parent's function scope
- slots - how? fake options/props like `$$_slot` and `$$_slot_name`?
- dom types?
- tests

TODO misc possible improvements

- all props are currently marked optional.
	- what's the right solution here?
	- need type information to infer required props (e.g. `export let foo: string;` can't be optional, at least with `strictNullChecks`)

*/

// The code generated here is for typechecking purposes only -
// it has no correlation to the Svelte-generated code.
// This works around the fact that Svelte internally doesn't handle TypeScript.
export const generateVirtualSvelteTs = (
	svelteFileId: string,
	tsSvelteCode: string,
	jsSvelteCode: string,
	markupAst: Node,
	vars: CompilationVars,
	{warn}: Logger,
): {code: string; map: RawSourceMap} => {
	const sn = new SourceNode(null, null, svelteFileId);
	sn.setSourceContent(svelteFileId, tsSvelteCode);

	// TypeScript's internal `ts.SourceFileLike` interface is
	// different from the external one, but it's the internal
	// one that's important for the API behavior we're relying on.
	// The cast to `any` gets around this issue.
	const tsFile: ts.SourceFileLike = {
		text: tsSvelteCode,
		end: tsSvelteCode.length,
		// `lineMap` gets populated by calls to `ts.getLineAndCharacterOfPosition`
		lineMap: undefined,
	} as any;

	const addStringAtLineAndCharacter = (
		line: number,
		character: number,
		str: string,
	): SourceNode => {
		return sn.add(new SourceNode(line, character, svelteFileId, str));
	};
	const addStringAt = (
		index: number,
		str = tsSvelteCode[index],
	): SourceNode => {
		// This TypeScript helper works for any text, not just TS,
		// and it's efficient because it caches a `lineMap` on the `tsFile` object.
		const {line, character} = ts.getLineAndCharacterOfPosition(tsFile, index);
		// TypeScript lines are 0-based and `source-map` lines are 1-based,
		// so add 1 to the line.
		return addStringAtLineAndCharacter(line + 1, character, str);
	};
	const addRange = (start: number, end: number): SourceNode[] => {
		let nodes: SourceNode[] = new Array(end - start); // TODO maybe don't do this? not using anywhere
		for (let i = start; i < end; i++) {
			nodes.push(addStringAt(i));
		}
		return nodes;
	};
	const addUnmappedRange = (
		unmappedStart: number,
		unmappedEnd: number,
	): SourceNode[] => {
		const start = mapIndexToOriginalTs(unmappedStart);
		const end = start + unmappedEnd - unmappedStart;
		return addRange(start, end);
	};
	// This helper creates mappings for each character in a string.
	// TODO is this misusing the `source-map` API?
	// const addStringChars = (str: string, index: number): SourceNode[] => {
	// 	const nodes: SourceNode[] = new Array(str.length);
	// 	for (let i = 0; i < str.length; i++) {
	// 		nodes[i] = addStringAt(index + i, str[i]);
	// 	}
	// 	return nodes;
	// };
	// This helper creates mappings for the first and last characters of a string.
	// TODO is this misusing the `source-map` API?
	const addStringRange = (
		str: string,
		start: number,
		end: number,
	): [SourceNode, SourceNode] => {
		const startNode = addStringAt(start, str[0]);
		// TODO can we do `slice(0, -1)` in the previous line and remove next line?
		if (str.length > 2) sn.add(str.slice(1, -1));
		const endNode =
			str.length > 1 ? addStringAt(end, str[str.length - 1]) : startNode;
		return [startNode, endNode];
	};

	// This data is used as a hacky method to map compiled AST ranges
	// back to the original TypeScript, before it was preprocessed.
	const jsScripts = extractScriptData(jsSvelteCode);
	const tsScripts = extractScriptData(tsSvelteCode);
	const mapIndexToOriginalTs = createIndexMappingHelper(jsScripts, tsScripts);

	// add the script strings with mappings for each character
	for (const {str, contentStr, attrs, start} of tsScripts) {
		if (attrs.lang !== 'ts') {
			throw Error(`TODO how to handle langs other than ts?`);
		}
		const contentStrIndex = str.indexOf(contentStr);
		sn.add('\n/* ' + str.substring(0, contentStrIndex) + ' */');
		const contentStartIndex = start + contentStrIndex;
		const contentEndIndex = contentStartIndex + contentStr.length;
		addRange(contentStartIndex, contentEndIndex);
		sn.add('/* </script> */\n');
	}

	sn.add('\n/* markup */\n');

	let indents = 0;
	const indent = (add = 0): string => '\t'.repeat(indents + add);
	const openBlock = (): SourceNode => {
		indents++;
		return sn.add(`${indent(-1)}{\n`);
	};
	const closeBlock = (): SourceNode => {
		indents--;
		return sn.add(`${indent()}};\n`);
	};

	const addMustacheTag = (node: Node): void => {
		if (node.expression.type === 'Literal') return; // no typechecking
		sn.add(indent());
		addUnmappedRange(node.expression.start, node.expression.end);
		sn.add(';\n');
	};

	const addInlineComponent = (node: Node): void => {
		openBlock();

		const {attributes} = node;
		const startIndex = mapIndexToOriginalTs(node.start);
		const endIndex = startIndex + node.end - node.start;

		printMarkupComment(startIndex, endIndex);

		// initialize component constructor
		sn.add(`${indent()}new `);

		// add the component name as the newed class name
		const nameStartIndex = startIndex + 1;
		const nameEndIndex = nameStartIndex + node.name.length;
		addRange(nameStartIndex, nameEndIndex);

		// Add 'props' with source mapping back to the markup as best as possible.
		// This acts as a bandaid for diagnostics not pointing directly to
		// props when one has an error.
		// See this comment for more: "TODO try to improve source mappings"
		sn.add(`({\n${indent(1)}target: null as any,\n${indent(1)}`);
		addStringRange('props', startIndex, nameEndIndex);
		sn.add(`: {\n`);

		// add attributes as props
		for (const attr of attributes) {
			if (attr.type === 'Attribute') {
				if (attr.value.length > 1) {
					// TODO what is this case?
					throw Error(`Attributes with more than 1 value are not supported.`);
				}
				if (!attr.value.length) {
					throw Error(`TODO attr shorthand?`);
				}
				const value = attr.value[0];

				switch (value.type) {
					case 'Text': {
						sn.add(indent(2));

						// add the attribute name as the prop name
						addUnmappedRange(attr.start, attr.start + attr.name.length);

						sn.add(': ');

						// add the attribute string value
						sn.add(`'`);
						addUnmappedRange(value.start, value.end);
						sn.add(`'`);
						break;
					}
					case 'MustacheTag': {
						sn.add(indent(2));

						// add the attribute name as the prop name
						addUnmappedRange(attr.start, attr.start + attr.name.length);

						sn.add(': ');

						// add the attribute value
						addUnmappedRange(value.expression.start, value.expression.end);

						break;
					}
					case 'AttributeShorthand': {
						sn.add(indent(2));

						// maps directly to object literal shorthand syntax
						addUnmappedRange(value.expression.start, value.expression.end);
						break;
					}
					default: {
						warn(`Unhandled attribute value type '${value.type}'`);
						break;
					}
				}
				sn.add(',\n'); // attribute line ending
			} else if (attr.type === 'Spread') {
				sn.add(`${indent(2)}...`);
				addUnmappedRange(attr.expression.start, attr.expression.end);
				sn.add(',\n');
			}
		}

		sn.add(`${indent(1)}},\n${indent()}});\n`);
	};

	const openIfBlock = (node: Node): void => {
		if (node.elseif) {
			sn.add('if (');
		} else {
			sn.add(`${indent()}if (`);
			indents++;
		}
		addUnmappedRange(node.expression.start, node.expression.end);
		sn.add(') {\n');
	};
	const closeIfBlock = (node: Node): void => {
		if (
			!node.else ||
			!(
				node.else.children &&
				node.else.children[0] &&
				node.else.children[0].elseif
			)
		) {
			indents--;
			sn.add(`${indent()}}\n`);
		}
	};
	const openElseBlock = (node: Node): void => {
		if (node.children && node.children[0] && node.children[0].elseif) {
			sn.add(`${indent(-1)}} else `);
		} else {
			sn.add(`${indent(-1)}} else {\n`);
		}
	};

	const openEachBlock = (node: Node): void => {
		console.log(JSON.stringify(node));
		const {expression, context, index, key} = node;
		// Check for some assumptions that may not be true.
		if (context.type !== 'Identifier') {
			throw Error(`Unhandled #each context type '${context.type}'`);
		}
		if (typeof index !== 'string') {
			throw Error(`Unhandled #each index type '${typeof index}'`);
		}

		// mapping `index` to the source is a bit tricky,
		// and I'm not sure what if anything is gained, but it's not too difficult
		const indexStart = mapIndexToOriginalTs(
			jsSvelteCode.substring(context.end, node.end).indexOf(index) +
				context.end,
		);
		const indexEnd = indexStart + index.length;

		// map expression
		const expressionStart = mapIndexToOriginalTs(expression.start);
		const expressionEnd = expressionStart + expression.end - expression.start;

		sn.add(`${indent()}for (let `);
		addRange(indexStart, indexEnd);
		sn.add(` = 0; `);
		addRange(indexStart, indexEnd);
		sn.add(` < (`);
		addRange(expressionStart, expressionEnd);
		sn.add(`)`);
		addStringAt(expressionStart, '.');
		addStringRange('length', expressionStart, expressionEnd);
		sn.add(`; `); // TODO does `.length` need to be mapped?
		addRange(indexStart, indexEnd);
		sn.add(`++) {\n`);
		indents++;

		// add the context declaration
		sn.add(`${indent()}const `);
		addUnmappedRange(context.start, context.end);
		sn.add(' = ');
		addRange(expressionStart, expressionEnd);
		addStringAt(expressionStart, '[');
		addRange(indexStart, indexEnd);
		addStringAt(expressionEnd, ']');
		sn.add(`;\n`);
		// sn.add(`];\n`);

		// add the key expression
		sn.add(indent());
		addUnmappedRange(key.start, key.end);
		sn.add(';\n');
	};
	const closeEachBlock = (_node: Node): void => {
		indents--;
		sn.add(`}\n`);
	};

	const awaitBlocks: Node[] = [];
	const addAwaitBlock = (node: Node): void => {
		if (awaitBlocks.includes(node)) {
			throw Error('Await block is already added');
		}
		awaitBlocks.push(node);
	};
	const removeAwaitBlock = (node: Node): void => {
		if (awaitBlocks[awaitBlocks.length - 1] !== node) {
			throw Error('Await block cannot be removed');
		}
		awaitBlocks.pop();
	};
	const getCurrentAwaitBlock = (): Node => {
		const {length} = awaitBlocks;
		if (!length) throw Error('Not inside an await block');
		return awaitBlocks[length - 1];
	};
	const openPromiseBlock = (promiseMethod: string): void => {
		const node = getCurrentAwaitBlock();
		// This doesn't chain the promise methods,
		// but that looks irrelevant for typechecking.
		// It could chain the methods by tracking if the expression
		// has been added for a given node. (a bit more complexity)
		const {expression} = node;
		const expressionStart = mapIndexToOriginalTs(expression.start);
		const expressionEnd = expressionStart + expression.end - expression.start;
		sn.add(indent());
		addRange(expressionStart, expressionEnd);
		sn.add('.');
		addStringRange(promiseMethod, expressionStart, expressionEnd);
		sn.add('((');
		const cbArg =
			promiseMethod === 'then'
				? node.value
				: promiseMethod === 'catch'
				? node.error
				: null;
		if (!cbArg) throw Error('Failed to infer a valid callback arg');
		addStringRange(cbArg, expressionStart, expressionEnd);
		sn.add(') => {\n');
		indents++;
	};
	const closePromiseBlock = () => {
		indents--;
		sn.add(`${indent()}});\n`);
	};
	const openAwaitBlock = (node: Node): void => {
		addAwaitBlock(node);
	};
	const openThenBlock = (node: Node): void => {
		if (node.skip) return;
		openPromiseBlock('then');
	};
	const openCatchBlock = (node: Node): void => {
		if (node.skip) return;
		openPromiseBlock('catch');
	};
	const closeAwaitBlock = (node: Node): void => {
		removeAwaitBlock(node);
	};
	const closeThenBlock = (node: Node): void => {
		if (node.skip) return;
		closePromiseBlock();
	};
	const closeCatchBlock = (node: Node): void => {
		if (node.skip) return;
		closePromiseBlock();
	};

	// adds a comment duplicating a range of the original Svelte
	// for better debugging and reading
	const printMarkupComment = (start: number, end: number): SourceNode => {
		const str = tsSvelteCode.substring(start, end);
		const content = str.includes('\n')
			? `${indent()}/*\n${str}\n${indent()}*/\n`
			: `${indent()}/* ${str} */\n`;
		return sn.add(content);
	};

	// let walkingInlineComponent = 0;
	// console.log(JSON.stringify(markupAst));
	walk(markupAst, {
		enter(node, _parent, _prop, _index) {
			switch (node.type) {
				// svelte compiler types
				case 'AwaitBlock': {
					openAwaitBlock(node);
					break;
				}
				// case 'PendingBlock': {} // needs no special handling
				case 'ThenBlock': {
					openThenBlock(node);
					break;
				}
				case 'CatchBlock': {
					openCatchBlock(node);
					break;
				}
				// case 'Body': {}
				// case 'Comment': {}
				case 'EachBlock': {
					openEachBlock(node);
					break;
				}
				// case 'Element': {}
				// case 'Head': {}
				case 'IfBlock': {
					openIfBlock(node);
					break;
				}
				case 'ElseBlock': {
					openElseBlock(node);
					break;
				}
				case 'InlineComponent': {
					// walkingInlineComponent++;
					addInlineComponent(node);
					break;
				}
				case 'MustacheTag': {
					// mustache tags for inline components are handled separately
					// TODO this is broken for children with mustache tags
					// if (walkingInlineComponent) break;
					addMustacheTag(node);
					break;
				}
				// case 'Options': {}
				// case 'RawMustacheTag': {}
				// case 'DebugTag': {}
				// case 'Slot': {}
				// case 'Text': {}
				// case 'Title': {}
				// case 'Window': {}

				// case 'Action': {}
				// case 'Animation': {}
				// case 'Binding': {}
				// case 'Class': {}
				// case 'EventHandler': {}
				// case 'Let': {}
				// case 'Ref': {}
				// case 'Transition': {}

				// case 'Attribute': {}
				// case 'Spread': {}

				// estree types
				// case 'Literal': {}
				// case 'Identifier': {}
				// case 'ParenthesizedExpression': {}
				// case 'MemberExpression': {}
				// case 'NewExpression': {}
				// case 'CallExpression': {}
				// case 'ArrayExpression': {}
				// case 'UpdateExpression': {}
				// case 'UnaryExpression': {}
				// case 'BinaryExpression': {}
				// case 'LogicalExpression': {}
				// case 'ConditionalExpression': {}
				// case 'AssignmentExpression': {}
				// case 'YieldExpression': {}
				// case 'SpreadElement': {}
				// case 'SequenceExpression': {}

				default: {
					break;
				}
			}
		},
		leave(node, _parent, _prop, _index) {
			switch (node.type) {
				case 'InlineComponent': {
					closeBlock();
					break;
				}
				case 'IfBlock': {
					closeIfBlock(node);
					break;
				}
				case 'EachBlock': {
					closeEachBlock(node);
					break;
				}
				case 'AwaitBlock': {
					closeAwaitBlock(node);
					break;
				}
				// case 'PendingBlock': {} // needs no special handling
				case 'ThenBlock': {
					closeThenBlock(node);
					break;
				}
				case 'CatchBlock': {
					closeCatchBlock(node);
					break;
				}
			}
		},
	});

	sn.prepend(`/* ${svelteFileId} */
interface Props {
${vars
	.map(v =>
		// add source mappings to these? currently I don't see a need.
		v.export_name && v.writable
			? `${indent(1)}${v.export_name}?: typeof ${v.name};`
			: null,
	)
	.filter(Boolean)
	.join('\n')}
}
export default class Component {
	constructor(
		_options: {
			target: Element;
			anchor?: Element;
			props?: Props;
			hydrate?: boolean;
			intro?: boolean;
		}
	) {}
};\n`);

	const result = sn.toStringWithSourceMap();
	return {
		code: result.code,
		map: result.map.toJSON(),
	};
};

const parseAttributes = (
	attrsStr: string,
): Record<string, string | boolean> => {
	const attrs: Record<string, string | boolean> = {};
	for (const attrStr of attrsStr.split(/\s+/)) {
		if (!attrStr) continue;
		const [name, valueStr] = attrStr.split('=');
		const value = valueStr
			? /^['"]/.test(valueStr)
				? valueStr.slice(1, -1)
				: valueStr
			: true;
		attrs[name] = value;
	}
	return attrs;
};

const SVELTE_SCRIPT_MATCHER = /<script(\s[^]*?)?>([^]*?)<\/script>/gi;

interface ScriptData {
	start: number;
	end: number;
	str: string;
	attrsStr: string;
	contentStr: string;
	attrs: Record<string, string | boolean>;
}

const extractScriptData = (svelteCode: string): ScriptData[] => {
	const scripts: ScriptData[] = [];

	let scriptsExecResult: RegExpExecArray | null = null;
	while ((scriptsExecResult = SVELTE_SCRIPT_MATCHER.exec(svelteCode))) {
		const {index} = scriptsExecResult;
		const [str, attrsStr, contentStr] = scriptsExecResult;
		const attrs = parseAttributes(attrsStr);
		scripts.push({
			start: index,
			end: index + str.length,
			str,
			attrsStr,
			contentStr,
			attrs,
		});
	}

	// sort with `context=module` first, just in case the code is silly
	scripts.sort(a => (a.attrs.context === 'module' ? -1 : 1));

	return scripts;
};

const createIndexMappingHelper = (
	jsScripts: ScriptData[],
	tsScripts: ScriptData[],
): ((index: number) => number) => {
	// The JS/TS script ranges should be set by this point,
	// so we can compute the differences between them,
	// which get used to map ranges from the JS AST back to the original TS.
	const scriptLengthDiffs = tsScripts.map(({start, end}, i) => {
		const tsScriptLength = end - start;
		const jsScriptLength = jsScripts[i].end - jsScripts[i].start;
		return jsScriptLength - tsScriptLength;
	});

	// This hacky function is able to map indices from preprocessed+compiled
	// JS Svelte AST back to the unpreprocessed TS Svelte by relying on the
	// markup being unchanged by preprocessing.
	// It simply diffs the script blocks lengths
	// between the two versions and offets the indices appropriately.
	// This is a terrible and brittle hack but I think it'll work
	// as long as `<script>` and `</script>` tags do not have any markup
	// on the same lines, which is weird anyway.
	const mapIndexToOriginalTs = (index: number): number => {
		let numScriptsBeforeStartIndex = 0;
		for (const {end} of jsScripts) {
			if (end < index) {
				numScriptsBeforeStartIndex++;
			}
		}

		let finalIndex = index;
		for (let i = 0; i < numScriptsBeforeStartIndex; i++) {
			finalIndex -= scriptLengthDiffs[i];
		}

		return finalIndex;
	};

	return mapIndexToOriginalTs;
};
