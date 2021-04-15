set -e
deno test --unstable --allow-all
deno fmt
deno lint --unstable