/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3346940990")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3346940990",
    "hidden": false,
    "id": "relation1841317061",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "group",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3346940990")

  // remove field
  collection.fields.removeById("relation1841317061")

  return app.save(collection)
})
