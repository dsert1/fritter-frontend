import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();

    const user = new UserModel({username, password, dateJoined});
    user.lastPosted = undefined;
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Get all the users in the database
   *
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the users
   */
   static async findAll(): Promise<Array<HydratedDocument<User>>> {
    return UserModel.find();
  }

  /**
   * Makes it so that user 2 follows user 1
   *
   * @param {string} user1 - The username of the user1
   * @param {string} user2 - The username of the user2
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
   static async addOneFollower(user1: string, user2: string): Promise<void> {
    const user1Object = await this.findOneByUsername(user1);
    const user2Object = await this.findOneByUsername(user2);
    if (!user1Object.followers.includes(user2)) {
      user1Object.followers.push(user2);
    }
    if (!user2Object.following.includes(user1)) {
      user2Object.following.push(user1);
    }

    await user1Object.save();
    await user2Object.save();
  }

  /**
   * Makes it so that user 2 follows user 1
   *
   * @param {string} user1 - The username of the user1
   * @param {string} user2 - The username of the user2
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
   static async removeOneFollower(user1: string, user2: string): Promise<void> {
    const user1Object = await this.findOneByUsername(user1);
    const user2Object = await this.findOneByUsername(user2);
    user1Object.followers = user1Object.followers.filter(u => u != user2)
    user2Object.following = user2Object.following.filter(u => u != user1);

    await user1Object.save();
    await user2Object.save();
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    if (!username) {
      throw Error("The username field is empty.");
    }
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

   /**
   * Gets a user's streak.
   *
   * @param {string} username - The username of the user to find
   * @return {number} - The streak associated with that user, if exists
   */
    static async getLastPosted(username: string | any): Promise<Date> {
      const user = await this.findOneByUsername(username);
      return user.lastPosted;
    }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
