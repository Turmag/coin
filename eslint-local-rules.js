const path = require('node:path');
const fs = require('node:fs');
const resolve = require('resolve');

const aliasesObj = {
    '@main': path.resolve(__dirname, './src/components/main'), 
    '@header': path.resolve(__dirname, './src/components/header'),
    '@': path.resolve(__dirname, './src'), 
};

const aliases = Object.entries(aliasesObj);

module.exports = {
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
            return context.parserServices?.defineTemplateBodyVisitor ? context.parserServices.defineTemplateBodyVisitor({
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

                    if (node.directive && node.key.name !== 'bind' && node.value?.expression.value && node.value.expression.value === Boolean(node.value.expression.value)) {
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
            }) : {};
        },
    },

    'add-vue-extension': {
        meta: {
            fixable: 'code',
            docs: {
                description: 'require .vue in vue files',
                recommended: false,
            },
            schema: [],
        },
        create(context) {
            return {
                ImportDeclaration(node) {
                    const basedir = path.dirname(path.resolve(context.getFilename()));
                    let nodeName = node.source.value;

                    aliases.every(([key, value]) => {
                        if (nodeName.includes(key)) nodeName = nodeName.replace(key, value);
                        else return nodeName === node.source.value;
                    });

                    let filePath;
                    try {
                        filePath = resolve.sync(nodeName, { basedir });
                    } catch (_err) {
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
            schema: [],
        },
        create(context) {
            return {
                ImportDeclaration(node) {
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
                        if (nodeNameWithoutAlias.includes(value)) {
                            resultNodeName = nodeNameWithoutAlias.replace(value, key).replace(/\\/ig, '\/');
                        } else return resultNodeName === nodeName;
                    });

                    if (nodeName !== resultNodeName) {
                        context.report({
                            node,
                            message: 'Use shortest alias',
                            fix: fixer => {
                                let replaceText = '';
                                if (node.specifiers[0].type === 'ImportDefaultSpecifier') {
                                    replaceText = `import ${node.specifiers[0].local.name} from '${resultNodeName}';`;
                                } else {
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
};
