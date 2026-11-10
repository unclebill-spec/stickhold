const CODE = "ERR_MODULE_NOT_FOUND";

function missing(err) {
	return err?.code === CODE || err?.cause?.code === CODE;
}

function relativeBare(specifier) {
	if (specifier.startsWith("./") || specifier.startsWith("../")) {
		return !/\.(?:[cm]?js|ts|json|node|wasm|mjs)$/.test(specifier);
	}
	return false;
}

export async function resolve(specifier, context, nextResolve) {
	if (!relativeBare(specifier)) return nextResolve(specifier, context);
	try {
		return await nextResolve(specifier, context);
	} catch (err) {
		if (!missing(err)) throw err;
		return nextResolve(`${specifier}.ts`, context);
	}
}
