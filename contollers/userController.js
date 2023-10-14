import User from "../models/User.js";

export const user = async (req, res) => {
    try {
        const { id } = req.query;

        console.log(id);
        const user = await User.findById(id);

        if (user) {
            res.status(200).json({ ok: true, user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { user } = req.body;

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, user);

        if (updatedUser) {
            return res.status(200).json(updatedUser);
        } else {
            console.log("User not found or not updated");
            return res.status(404).json({ message: "User not found or not updated" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateFriend = async (req, res) => {
    const friendId = req.params.friendId;
    const { userId } = req.body;

    const user = await User.findById(friendId);

    if (user.friends.includes(userId)) {
        user.friends.remove(userId);
    } else {
        user.friends.push(userId);
    }

    if (await user.save()) {
        console.log(user);
        res.status(200).json(user);
    } else {
        res.status(500).json({ message: "Failed to update user" });
    }
};

export const fetchFriends = async (req, res) => {
    const { id } = req.query;

    const user = await User.findById(id);
    const friendsArray = user.friends;

    try {
        const friends = await User.find({ _id: { $in: friendsArray } });

        if (friends.length > 0) {
            console.log(friends);
            return res.status(200).json(friends);
        } else {
            return res.status(404).json({ message: "No friends found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchAccounts = async (req, res) => {
    const { searchQuery, userId } = req.query;

    try {
        const users = await User.find({
            _id: { $ne: userId },
            $or: [
                { username: { $regex: searchQuery, $options: "i" } },
                { fName: { $regex: searchQuery, $options: "i" } },
                { lName: { $regex: searchQuery, $options: "i" } },
                {
                    $and: [
                        { fName: { $regex: searchQuery, $options: "i" } },
                        { lName: { $regex: searchQuery, $options: "i" } },
                    ],
                },
            ],
        });

        if (users) {
            res.status(200).json(users);
        } else {
            return res.status(404).json({ message: "No friends found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const addNotification = async (req, res) => {
    const { id } = req.params;
    let { notificationMessage } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        notificationMessage.createdAt = new Date();
        user.notifications.push(notificationMessage);

        console.log(notificationMessage);

        await user.save();

        res.status(200).json({ message: "Notification added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
