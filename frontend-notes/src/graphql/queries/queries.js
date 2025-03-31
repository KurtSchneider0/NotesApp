export const getNote = `
  query NoteQuery($id: ID!) {
    getNote(id: $id) {
      author
      content
      name
      id
    }
  }
`

export const listNotes = `
  query NoteQuery {
    listNotes {
      author
      content
      name
      id
    }
  }
`