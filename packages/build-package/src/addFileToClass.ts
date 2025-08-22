import ts from 'typescript'
import fs from 'fs/promises'
import path from 'path'

export const transformClientFiles = async (folder: string) => {
  const entries = await fs.readdir(folder, {
    withFileTypes: true,
    recursive: true
  })

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.client.js')) {
      const p = path.posix.join(entry.parentPath, entry.name)
      const code = await fs.readFile(p, { encoding: 'utf-8' })

      // I should make this path something like `$$@hd-web/components$$/dist/...
      // which I can transform to C://Users/.../node_modules/@hd-web/components/...
      // when building the jsx.
      await fs.writeFile(p, addFileToClass(code))
    }
  }
}

const addFileToClass = (input: string) => {
  return ts.transpileModule(input, {
    transformers: { before: [transformer()] },
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText
}

const transformer = (): ts.TransformerFactory<ts.SourceFile> => (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      if (ts.isClassDeclaration(node)) {
        const staticProp = ts.factory.createPropertyDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
          '__file',
          undefined,
          undefined,
          ts.factory.createPropertyAccessExpression(
            ts.factory.createMetaProperty(
              ts.SyntaxKind.ImportKeyword,
              ts.factory.createIdentifier('meta')
            ),
            ts.factory.createIdentifier('url')
          )
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
