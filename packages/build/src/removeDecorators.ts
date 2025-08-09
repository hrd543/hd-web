import ts from 'typescript'

// If I support more than esbuild, might need to change this file.

export const transformBuiltJs = (code: string, dev: boolean) => {
  if (dev) {
    return code
  }

  return removeUnneededJs(code)
}

/**
 * Removes all decorators and exports from the input code.
 */
const removeUnneededJs = (input: string) => {
  return ts.transpileModule(input, {
    transformers: { before: [transformer] },
    compilerOptions: {
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    }
  }).outputText
}

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      // TODO: Only remove hd-web decorators
      if (ts.isDecorator(node)) {
        return
      }

      // Delete exports as well
      if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
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
