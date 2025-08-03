import ts from 'typescript'

/**
 * Removes all decorators from the input code.
 */
export const removeDecorators = (input: string) => {
  return ts.transpileModule(input, {
    transformers: { before: [transformer] },
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText
}

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      // Do I need to check more information?
      if (ts.isDecorator(node)) {
        return
      }

      return ts.visitEachChild(node, visitor, context)
    }

    const sourceFileVisitor = (sourceFile: ts.SourceFile): ts.SourceFile => {
      return ts.visitEachChild(sourceFile, visitor, context)
    }

    return ts.visitNode(sourceFile, sourceFileVisitor, ts.isSourceFile)
  }
}
