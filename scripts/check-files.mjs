import { execFileSync } from 'node:child_process'

const allowed = /^(?:\.gitignore|README\.md|Start-Slides\.ps1|index\.html|package(?:-lock)?\.json|vite\.config\.js|\.github\/workflows\/pages\.yml|src\/[a-zA-Z0-9.-]+|scripts\/[a-zA-Z0-9.-]+\.mjs|test\/[a-zA-Z0-9.-]+\.js|meetings\/\d{4}-\d{2}-\d{2}\/notes\.compact\.json)$/
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const unexpected = files.filter((file) => !allowed.test(file))
if (unexpected.length) throw new Error(`bestanden buiten het slidesysteem: ${unexpected.join(', ')}`)
console.log(`${files.length} gevolgde bestanden; alleen slides en noodzakelijke systeemfiles`)
