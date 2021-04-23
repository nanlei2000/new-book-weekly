set -e
deno test --unstable --allow-all
deno fmt
deno lint --unstable
deno test --unstable --allow-all --filter "commitChanges"