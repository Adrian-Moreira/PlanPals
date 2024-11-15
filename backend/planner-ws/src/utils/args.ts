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
