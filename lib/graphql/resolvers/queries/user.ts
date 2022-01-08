import User from "../../../models/user";

  export async function checkAndDefaultRoles(_:any, {email}:any, { req}: any){
      let user = await User.findOne({email: email});
      if (user.creator !== false && user.creator != true) 
       await User.findOneAndUpdate({email: email}, {creator: false}, {new: true});
      console.log( await User.findOne({email: email}))
  }

  export async function isCreator(_:any, {email}:any, { req}: any){
      let user = await User.findOne({email: email});
      try {
      return user.creator;
          
      } catch (error) {
          return false;
      }
  }