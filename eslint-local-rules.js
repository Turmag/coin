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
            return context.parserServices?.defineTemplateBodyVisitor({
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
            });
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
                    console.log('node.source', node.source);
                    if(node.source.value.includes('bad-import-declaration')) {
                        context.report({
                            node,
                            message: 'Use proper import',
                            fix: fixer => fixer.replaceText(node, node.specifiers.map(specifier =>`import ${specifier.local.name} from 'good-import-declaration';`).join('\n')),
                        });
                    }
                },
            };
        },
    },
};
