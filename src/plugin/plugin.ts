
import path, { posix } from 'path'
import { createHash } from 'crypto'
import type { ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import mm from 'micromatch'
import MagicString from 'magic-string'
import fg from 'fast-glob'


export default function PluginAutoClear(): Plugin {

  return {
    name: 'vite-plugin-auto-clear',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.vue')) {
        const s = new MagicString(code)
        const match = mm.match(id, ['**/src/**/*'], { dot: true })
        if (match.length) {
          console.log('match', match);
          const reg = /<script [\s\S]*<\/script>/
          const result = code.match(reg)
          const watchReg = /watch\([\s\S]*\)/
          const watchResult = code.match(watchReg)
          if (watchResult && result) {
            const hasClearEffect = code.includes('onScopeDispose')
            if (!hasClearEffect) {
              const importCode = `import { onScopeDispose } from 'vue'`
              const frontInsertion = new RegExp(/<script setup[^<>]*>/)
              const frontInsertionResult = code.match(frontInsertion)
              s.appendLeft(frontInsertionResult[0].length + frontInsertionResult?.index, `import { onScopeDispose } from 'vue'`)
            }
            console.log(s.toString());

            const watchCode = watchResult ? watchResult[0] : ''
            const hash = `watch${createHash('sha256')
              .digest('hex')
              .slice(0, 8)
              }`
            const newCode = `const ${hash} = ${watchCode}`
            s.overwrite(watchResult.index!, watchResult.index! + watchResult[0].length, newCode)
            const clearEffect = `onScopeDispose(() => {
              watch${hash} && watch${hash} ()
              })`
            code.match(/<\/script>/) ?
              s.appendRight(code.match(/<\/script>/)!.index!, clearEffect)
              : code
          }
        }
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }),
        }
      }
    }
  }
}



