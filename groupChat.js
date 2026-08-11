class User {
  constructor({ userId, isAdmin, groupsInWhich, createdGroupsByThisUser }) {
    this.userId = userId;
    this.isAdmin = isAdmin;
    this.groupsInWhich = groupsInWhich; //set
    this.createdGroupsByThisUser = createdGroupsByThisUser; //set
  }
}

class Group {
  constructor({ groupId, adminId, membersWhichAreIn }) {
    this.groupId = groupId;
    this.adminId = adminId;
    this.membersWhichAreIn = membersWhichAreIn; //set
  }
}

class System {
  constructor() {
    this.users = new Map();
    this.groups = new Map();
  }

  createUser({ userId, isAdmin }) {
    const user = new User({
      userId,
      isAdmin,
      groupsInWhich: new Set(),
      createdGroupsByThisUser: new Set(),
    });

    this.users.set(userId, user);
  }

  createGroup({ userId, groupId }) {
    const userData = this.users.get(userId);
    if (
      userData?.isAdmin &&
      userData.createdGroupsByThisUser.size < 5 &&
      !this.groups.has(groupId)
    ) {
      const group = new Group({
        groupId,
        adminId: userId,
        membersWhichAreIn: new Set(),
      });

      this.groups.set(groupId, group);
      userData.createdGroupsByThisUser.add(groupId);
    }
  }

  addUserToGroup({ userId, groupId, adminId }) {
    const user = this.users.get(userId);
    const admin = this.users.get(adminId);
    const group = this.groups.get(groupId);

    if (
      user &&
      admin?.isAdmin &&
      group?.adminId === adminId &&
      user.groupsInWhich.size < 20 &&
      !group.membersWhichAreIn.has(userId)
    ) {
      group.membersWhichAreIn.add(userId);
      user.groupsInWhich.add(groupId);
    }
  }

  removeUserFromGroup({ userId, groupId, adminId }) {
    const user = this.users.get(userId);
    const admin = this.users.get(adminId);
    const group = this.groups.get(groupId);

    if (
      user &&
      admin?.isAdmin &&
      group?.adminId === adminId &&
      group.membersWhichAreIn.has(userId)
    ) {
      group.membersWhichAreIn.delete(userId);
      user.groupsInWhich.delete(groupId);
    }
  }
}
