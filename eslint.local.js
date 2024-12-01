/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path');
const fs = require('node:fs');
const resolve = require('resolve');

const entitiesOrder = ['external', 'vue', 'component', 'composable', 'store', 'mixin', 'type', 'constant', 'method', 'api'];
const determineEntity = (value, specifiers) => {
    let entity = 'external';
    value = value.toLowerCase();

    if (value === 'vue') entity = 'vue';
    else if (value.includes('mixin')) entity = 'mixin';
    else if (value.includes('.vue') || value.includes('kit')) entity = 'component';
    else if (value.includes('composable') || specifiers && specifiers[0]?.local.name.toLowerCase().includes('use')) entity = 'composable';
    else if (value.includes('store')) entity = 'store';
    else if (value.includes('type')) entity = 'type';
    else if (value.includes('constant')) entity = 'constant';
    else if (value.includes('helper') || value.includes('utils')) entity = 'method';
    else if (value.includes('api')) entity = 'api';

    return entity;
};

module.exports = {
    rules: {
        'prefer-true-attribute-shorthand': {
            meta: {
                fixable: 'code',
                docs: {
                    description:
                    'require shorthand form attribute when `v-bind` value is `true`',
                },
                schema: [{ enum: ['always', 'never'] }],
            },
            create(context) {
                const sourceCode = context.getSourceCode();
                return sourceCode.parserServices?.defineTemplateBodyVisitor
                    ? sourceCode.parserServices.defineTemplateBodyVisitor({
                        VAttribute(node) {
                            const option = context.options[0] || 'always';

                            if (option === 'never' && !node.directive && !node.value) {
                                context.report({
                                    node,
                                    message: 'Boolean prop with \'true\' value should be written in longhand form',
                                    fix: fixer => fixer.replaceText(node, `:${node.key.rawName}="true"`),
                                });
                            }

                            if (option !== 'always') return;

                            if (node.directive && node.key.name !== 'bind' && node.value?.expression?.value && node.value.expression.value === Boolean(node.value.expression.value)) {
                                const { argument } = node.key;
                                if (!argument) return;

                                context.report({
                                    node,
                                    message: 'Boolean prop with \'true\' value should be written in shorthand form',
                                    fix: fixer => {
                                        const sourceCode = context.getSourceCode();
                                        return fixer.replaceText(node, sourceCode.getText(argument));
                                    },
                                });
                            }
                        },
                    })
                    : {};
            },
        },

        'add-vue-extension': {
            meta: {
                fixable: 'code',
                docs: {
                    description: 'require .vue in vue files',
                    recommended: false,
                },
                schema: [{
                    type: 'object',
                    properties: { aliases: { type: 'object' } },
                }],
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        const aliases = Object.entries(context.options[0].aliases);
                        if (!aliases.length) return;

                        const basedir = path.dirname(path.resolve(context.getFilename()));
                        let nodeName = node.source.value;

                        aliases.every(([key, value]) => {
                            if (nodeName.includes(key)) nodeName = nodeName.replace(key, value);
                            else return nodeName === node.source.value;
                        });

                        let filePath;
                        try {
                            filePath = resolve.sync(nodeName, { basedir });
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (error) {
                            filePath = path.resolve(basedir, nodeName);
                        }

                        const vueExt = '.vue';
                        const findRealExtension = filePath => {
                            let realExt = fs.existsSync(filePath) ? path.extname(filePath) : null;
                            if (realExt === null) realExt = fs.existsSync(`${filePath}${vueExt}`) ? path.extname(`${filePath}${vueExt}`) : null;

                            return realExt;
                        };

                        const nodeNameExt = path.extname(nodeName);
                        const realExt = findRealExtension(filePath);

                        if (realExt === vueExt && realExt !== nodeNameExt) {
                            context.report({
                                node,
                                message: 'Use proper import of vue files',
                                fix: fixer => fixer.replaceText(node, node.specifiers.map(specifier => `import ${specifier.local.name} from '${node.source.value}${realExt}';`).join('\n')),
                            });
                        }
                    },
                };
            },
        },

        'use-shortest-alias': {
            meta: {
                fixable: 'code',
                docs: {
                    description: 'There are can be used shortest alias',
                    recommended: false,
                },
                schema: [{
                    type: 'object',
                    properties: { aliases: { type: 'object' } },
                }],
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        const aliases = Object.entries(context.options[0].aliases);
                        if (!aliases.length) return;

                        const nodeName = node.source.value;
                        let nodeNameWithoutAlias = nodeName;
                        let resultNodeName = nodeName;

                        aliases.every(([key, value]) => {
                            if (nodeNameWithoutAlias.includes(key)) nodeNameWithoutAlias = nodeNameWithoutAlias.replace(key, value);
                            else return nodeNameWithoutAlias === nodeName;
                        });

                        nodeNameWithoutAlias = nodeNameWithoutAlias.replace(/\\/ig, '\/');

                        aliases.every(([key, value]) => {
                            value = value.replace(/\\/ig, '\/');
                            if (nodeNameWithoutAlias.includes(value))
                                resultNodeName = nodeNameWithoutAlias.replace(value, key).replace(/\\/ig, '\/');
                            else return resultNodeName === nodeName;
                        });

                        if (nodeName !== resultNodeName) {
                            context.report({
                                node,
                                message: 'Use shortest alias',
                                fix: fixer => {
                                    let replaceText = '';
                                    if (node.specifiers[0].type === 'ImportDefaultSpecifier')
                                        replaceText = `import ${node.specifiers[0].local.name} from '${resultNodeName}';`;
                                    else {
                                        const specifiersArr = [];
                                        node.specifiers.forEach(specifier => specifiersArr.push(specifier.local.name));

                                        const replaceSign = specifiersArr.length > 2 ? '\n' : ' ';
                                        const replaceShiftSign = specifiersArr.length > 2 ? '\n    ' : ' ';
                                        replaceText = `import {${replaceShiftSign}${specifiersArr.join(`,${replaceShiftSign}`)}${specifiersArr.length > 2 ? ',' : ''}${replaceSign}} from '${resultNodeName}';`;
                                    }

                                    return fixer.replaceText(node, replaceText);
                                },
                            });
                        }
                    },
                };
            },
        },

        'import-entities-by-column-or-line': {
            meta: {
                fixable: 'code',
                docs: {
                    description: 'Prefered column or line import',
                    recommended: true,
                },
                schema: [{
                    type: 'object',
                    properties: { minProperties: { type: 'number' } },
                }],
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        if (!node.specifiers[0]) return;
                        if (node.specifiers[0].type === 'ImportDefaultSpecifier') return;
                        const minProperties = context.options[0].minProperties;

                        let areSmallAttributesInColumn = false;
                        let areLinesRepeated = false;
                        if (node.specifiers.length < minProperties) {
                            if (node.specifiers[0].loc.start.line !== node.specifiers[0].parent.loc.start.line) areSmallAttributesInColumn = true;
                        } else {
                            node.specifiers.every((specifier, i) => {
                                if (i === 0) return true;
                                if (specifier.loc.start.line === specifier.loc.end.line && node.specifiers[i - 1].loc.start.line === specifier.loc.start.line) areLinesRepeated = true;
                                else return !areLinesRepeated;
                            });
                        }

                        if (areLinesRepeated || areSmallAttributesInColumn) {
                            context.report({
                                node,
                                message: areLinesRepeated ? 'Use column import' : 'Use line import',
                                fix: fixer => {
                                    const specifiersArr = [];
                                    node.specifiers.forEach(specifier => specifiersArr.push(specifier.local.name));

                                    const replaceSign = areLinesRepeated ? '\n' : ' ';
                                    const replaceShiftSign = areLinesRepeated ? '\n    ' : ' ';
                                    const replaceText = `import {${replaceShiftSign}${specifiersArr.join(`,${replaceShiftSign}`)}${areLinesRepeated ? ',' : ''}${replaceSign}} from '${node.source.value}';`;

                                    return fixer.replaceText(node, replaceText);
                                },
                            });
                        }
                    },
                };
            },
        },

        'import-right-order': {
            meta: {
                fixable: 'code',
                docs: {
                    description: 'Prefered right import order',
                    recommended: true,
                },
                schema: [],
            },
            create(context) {
                let prevNode = null;
                const nodesArr = [];
                let isErrorOrderNode = false;
                let startReplaceRange = 0;
                let endReplaceRange = 0;

                return {
                    ImportDeclaration(node) {
                        nodesArr.push(node);

                        if (prevNode) {
                            const prevNodeEntity = determineEntity(prevNode.source.value, prevNode.specifiers);
                            const currentNodeEntity = determineEntity(node.source.value, node.specifiers);

                            const prevNodeIndex = entitiesOrder.indexOf(prevNodeEntity);
                            const currentNodeIndex = entitiesOrder.indexOf(currentNodeEntity);

                            prevNode.sortIndex = prevNodeIndex;
                            node.sortIndex = currentNodeIndex;

                            if (prevNodeIndex > currentNodeIndex && !isErrorOrderNode) {
                                isErrorOrderNode = true;
                            }
                        }

                        prevNode = node;

                        if (isErrorOrderNode) {
                            context.report({
                                node,
                                message: 'Use right import order',
                                fix: fixer => {
                                    const sortedNodesArr = structuredClone(nodesArr).sort((a, b) => a.sortIndex - b.sortIndex);

                                    const replacedNodesArr = [];
                                    sortedNodesArr.forEach((node, i) => {
                                        if (replacedNodesArr.length) replacedNodesArr.push(node);
                                        if (node.source.value !== nodesArr[i].source.value && !replacedNodesArr.length) {
                                            replacedNodesArr.push(node);
                                            startReplaceRange = nodesArr[i].range[0];
                                        }
                                        if (i === sortedNodesArr.length - 1) endReplaceRange = nodesArr[i].range[1];
                                    });

                                    let replaceText = '';

                                    replaceText = '';
                                    replacedNodesArr.forEach((node, i) => {
                                        if (!node.specifiers[0]) {
                                            replaceText += `import '${node.source.value}';`;
                                        } else if (node.specifiers[0].type === 'ImportDefaultSpecifier') {
                                            replaceText += `import ${node.specifiers[0].local.name} from '${node.source.value}';`;
                                        } else if (node.specifiers[0].type === 'ImportNamespaceSpecifier') {
                                            replaceText += `import * as ${node.specifiers[0].local.name} from '${node.source.value}';`;
                                        } else {
                                            const specifiersArr = [];
                                            node.specifiers.forEach(specifier => specifiersArr.push(specifier.local.name));

                                            const replaceSign = specifiersArr.length > 2 ? '\n' : ' ';
                                            const replaceShiftSign = specifiersArr.length > 2 ? '\n    ' : ' ';
                                            replaceText += `import {${replaceShiftSign}${specifiersArr.join(`,${replaceShiftSign}`)}${specifiersArr.length > 2 ? ',' : ''}${replaceSign}} from '${node.source.value}';`;
                                        }
                                        if (i < replacedNodesArr.length - 1) replaceText += '\n';
                                    });

                                    return fixer.replaceTextRange([startReplaceRange, endReplaceRange], replaceText);
                                },
                            });
                        }
                    },
                };
            },
        },
    },
};
