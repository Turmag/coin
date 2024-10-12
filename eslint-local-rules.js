const path = require('node:path');
const fs = require('node:fs');
const resolve = require('resolve');

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

                    if(node.directive && node.key.name !== 'bind' && node.value.expression.value) {
                        const { argument } = node.key;
                        if(!argument) return;

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
    'add-dot-vue': {
        meta: {
            fixable: 'code',
            docs: {
                description: 'My awesome ESLint local rule that will replace an import declaration with something else',
                category: 'Possible Errors',
                recommended: false,
            },
            schema: [],
        },
        create(context) {
            return {
                ImportDeclaration(node) {
                    const basedir = path.dirname(path.resolve(context.getFilename()));
                    const nodeName = node.source.value.replace('@', path.resolve(__dirname, './src'));

                    let filePath;
                    try {
                        filePath = resolve.sync(nodeName, { basedir });
                    } catch (_err) {
                        filePath = path.resolve(basedir, nodeName);
                    }

                    const existingExts = ['.vue'];
                    const findRealExtension = (filePath, extsIndex = 0) => {
                        let realExt = fs.existsSync(filePath) ? path.extname(filePath) : null;
                        if(realExt === null) realExt = fs.existsSync(`${filePath}${existingExts[extsIndex]}`) ? path.extname(`${filePath}${existingExts[extsIndex]}`) : null;

                        if(realExt !== null || extsIndex >= existingExts.length) return realExt;
                        return findRealExtension(filePath, extsIndex + 1);
                    };

                    const nodeNameExt = path.extname(nodeName);
                    const realExt = findRealExtension(filePath);

                    if(realExt === '.vue' && realExt !== nodeNameExt) {
                        context.report({
                            node,
                            message: 'Use proper import of vue files',
                            fix: fixer => fixer.replaceText(node, node.specifiers.map(specifier =>`import ${specifier.local.name} from '${node.source.value}${realExt}';`).join('\n')),
                        });
                    }
                },
            };
        },
    },
};
