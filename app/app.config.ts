// Same theme as the Clinika staff app (frontend/app/app.config.ts there), so the site and the app look like one product.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      secondary: 'sky',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'rose',
      neutral: 'slate',
    },
    card: {
      slots: {
        root: 'rounded-xl',
      },
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
    },
  },
})
