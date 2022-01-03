const { AuthenticationError } = require('apollo-server-express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {token, user};
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return {token, user};
    },
    saveBook: async (parent, { input }, context) => {
      const UserVar = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: input } },
        { new: true }
        );
        return updatedUser;
    },
    removeBook: async (parent, args, context) => {
      const UserVar = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
        );
        return updatedUser;
    }
  }
};

module.exports = resolvers;
