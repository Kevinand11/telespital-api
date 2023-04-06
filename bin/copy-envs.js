const fs = require('fs')

const paths = process.argv.slice(2)

if (fs.existsSync('env.json')) {
	const content = fs.readFileSync('env.json').toString()
	const envs = JSON.parse(content)

	// For root
	const entries = Object.entries({
		...(envs['root'] ?? {}),
		...(envs['general'] ?? {})
	}).map(([key, value]) => ([key, typeof value === 'object' ? JSON.stringify(value) : value]))
	const envFormattedEntries = entries.reduce((accumulator, currentValue) => {
		const [key, value] = currentValue
		return accumulator + `${key.toUpperCase()}=${value}\n`
	}, '')
	fs.writeFileSync(`./.env`, envFormattedEntries)

	// For all services
	paths.forEach((path) => {
		const entries = Object.entries({
			...(envs['root'] ?? {}),
			...(envs['general'] ?? {}),
			...(envs[path] ?? {})
		}).map(([key, value]) => ([key, typeof value === 'object' ? JSON.stringify(value) : value]))
		const envFormattedEntries = entries.reduce((accumulator, currentValue) => {
			const [key, value] = currentValue
			return accumulator + `${key.toUpperCase()}=${value}\n`
		}, '')
		fs.writeFileSync(`./services/${path}/.env`, envFormattedEntries)
	})
} else throw new Error('Env.json doesn\'t exist. Try creating one by copying the env.example.json')
