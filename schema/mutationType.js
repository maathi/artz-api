"use strict"

const {
  addArt,
  deleteArt,
  addUser,
  deleteUser,
  updateOwner,
} = require("../resolvers/mutation")
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql")
const { GraphQLUpload } = require("graphql-upload")

const { Art, User, File } = require("./types")
module.exports = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addArt: {
      type: Art,
      args: {
        name: { type: GraphQLString },
        file: { type: GraphQLNonNull(GraphQLUpload) },
        owner_id: { type: GraphQLInt },
        price: { type: GraphQLInt },
        description: { type: GraphQLString },
      },
      resolve: async (parent, args, { storeUpload }) => {
        let pic = await storeUpload(args.file)
        args = {
          name: args.name,
          pic,
          owner_id: args.owner_id,
          price: args.price,
          description: args.description,
        }
        addArt(args)
      },
    },
    deleteArt: {
      type: Art,
      args: { id: { type: GraphQLInt } },
      resolve: (_, args) => () => deleteArt(args),
    },
    addUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (_, args) => addUser(args),
    },
    singleUpload: {
      type: GraphQLNonNull(File),
      args: {
        file: {
          description: "File to store.",
          type: GraphQLNonNull(GraphQLUpload),
        },
      },
      resolve: (parent, { file }, { storeUpload }) => storeUpload(file),
    },
  }),
})
