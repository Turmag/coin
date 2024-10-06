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
            return context.parserServices.defineTemplateBodyVisitor({
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
};
