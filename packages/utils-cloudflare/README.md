This package exports `workers` under its own path, since worker specific scripts use packages from `cloudflare:xyz` modules which node doesn't like.

If everything were exported in the same index file, these imports would be discovered and an error thrown.
