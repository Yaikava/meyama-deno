// deno-lint-ignore-file no-explicit-any

export default {
  once: false,
  run(type: string, payload: any, response: any) {
    console.log(type, payload, response);
  },
};
