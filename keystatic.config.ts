import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
