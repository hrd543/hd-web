import ts from 'typescript'
import url from 'url'

export const addFileToClass = (input: string, path: string) => {
  const code = ts.transpileModule(input, {
    transformers: { before: [transformer(path)] },
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText

  if (path.endsWith('Header.client.js')) {
    console.log(code)
  }

  return code
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
            ts.factory.createStringLiteral(url.pathToFileURL(path).href)
          )

          const existingIndex = node.members.findIndex(
            (member) =>
              ts.isPropertyDeclaration(member) &&
              member.name &&
              ts.isIdentifier(member.name) &&
              member.name.text === '__file' &&
              member.modifiers?.some(
                (mod) => mod.kind === ts.SyntaxKind.StaticKeyword
              )
          )

          const membersCopy = [...node.members]

          if (existingIndex >= 0) {
            membersCopy[existingIndex] = staticProp
          } else {
            membersCopy.push(staticProp)
          }

          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            membersCopy
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
