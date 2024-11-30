/**
 * Process the command line flags and return an object with two properties:
 * - logLevel: a number between 0 and 3, or 3 if not given
 * - port: a number between 1000 and 65535, or 8000 if not given
 *
 * If the flags are invalid, print an error message and exit with code 1
 */
export const processFlags = (flags: {
	[x: string]: unknown;
	port: string;
	"log-level": string;
	_: Array<string | number>;
}) => {
	let logLevel, portNum;
	try {
		logLevel = parseInt(flags["log-level"]);
		if (logLevel > 3 || logLevel < 0) {
			console.error("Log level must be between 0 - 3");
			Deno.exit(1);
		}
	} catch (e) {
		console.error("Error: " + e);
		Deno.exit(1);
	}

	try {
		portNum = parseInt(flags["port"]);
		if (portNum <= 1000 || portNum > 65535) {
			console.error("Invalid port number");
			Deno.exit(1);
		}
	} catch (e) {
		console.error("Error: " + e);
		Deno.exit(1);
	}
	return { logLevel: logLevel ?? 3, port: portNum ?? 8000 };
};

/**
 * Given an object with a logLevel property, sets the logging level of the console.log(), console.debug(), and console.info() functions.
 * The logLevel is between 0 - 3, where 0 is the most verbose and 3 is the least verbose.
 * If logLevel is 3, all 3 functions are set to no-ops.
 * If logLevel is 2, console.debug() and console.info() are set to no-ops.
 * If logLevel is 1, only console.debug() is set to a no-op.
 * If logLevel is 0, none of the functions are changed.
 */
export const processLoglevel = ({ logLevel }: { logLevel: number }) => {
	if (logLevel === 3) {
		console.log = () => {};
		console.debug = () => {};
		console.info = () => {};
	}

	if (logLevel === 2) {
		console.debug = () => {};
		console.info = () => {};
	}

	if (logLevel === 1) {
		console.debug = () => {};
	}
};
