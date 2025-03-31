export const newNote = `
  mutation NoteMutation($id: ID, $name: String!, $content: String!, $author: String!) {
    newNote(note: {id: $id, name: $name, content: $content, author: $author}) {
      id
      name
      content
      author
    }
  }
`

export const deleteNote = `
  mutation NoteMutation($id: ID!) {
    deleteNote(id: $id)
  }
`