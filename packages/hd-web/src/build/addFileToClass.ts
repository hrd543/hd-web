import ts from 'typescript'

export const addFileToClass = (input: string, path: string) => {
  return ts.transpileModule(input, {
    transformers: { before: [transformer(path)] },
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText
}

const transformer =
  (path: string): ts.TransformerFactory<ts.SourceFile> =>
  (context) => {
    return (sourceFile) => {
      const visitor = (node: ts.Node): ts.Node | undefined => {
        if (ts.isClassDeclaration(node)) {
          const staticProp = ts.factory.createPropertyDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
            '__file',
            undefined,
            undefined,
            ts.factory.createStringLiteral(path)
          )
          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            [...node.members, staticProp]
          )
        }

        return ts.visitEachChild(node, visitor, context)
      }

      const sourceFileVisitor = (sourceFile: ts.SourceFile): ts.SourceFile => {
        return ts.visitEachChild(sourceFile, visitor, context)
      }

      return ts.visitNode(sourceFile, sourceFileVisitor, ts.isSourceFile)
    }
  }
