use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::serde::Serialize;
use calimero_sdk::{app, env};

#[app::state(emits = for<'a> Event<'a>)]
#[derive(BorshDeserialize, BorshSerialize, Default)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Icebreak {
    posts: Vec<Post>,
    users: Vec<User>,
    conversations: Vec<Conversation>, // Add this line to store conversations

}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Post {
    id: usize,
    title: String,
    content: String,
    comments: Vec<Comment>,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Comment {
    text: String,
    user: String,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct User {
    id: usize,
    name: String,
    profile: String,
    bio: String,
}



#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Conversation {
    id: usize,
    title: String,
    content: String,
    messages: Vec<Message>,
    users: Vec<usize>,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Message {
    id: usize,
    text: String,
    user: String,
    link_drop_key: String,
}

#[app::event]
pub enum Event<'a> {
    PostCreated {
        id: usize,
        title: &'a str,
        content: &'a str,
    },

    CommentCreated {
        post_id: usize,
        user: &'a str,
        text: &'a str,
    },

    UniversalEvent {
        id: usize,
        event_type: &'a str,
    },
}

#[app::logic]
impl Icebreak {
    #[app::init]
    pub fn init() -> Icebreak {
        Icebreak::default()
    }

    pub fn post(&self, id: usize) -> Option<&Post> {
        env::log(&format!("Getting post with id: {:?}", id));

        self.posts.get(id)
    }

    pub fn posts(&self) -> &[Post] {
        env::log("Getting all posts");
        &self.posts
    }

    pub fn create_post(&mut self, title: String, content: String) -> &Post {
        env::log(&format!(
            "Creating post with title: {:?} and content: {:?}",
            title, content
        ));

        app::emit!(Event::PostCreated {
            id: self.posts.len(),
            // todo! should we maybe only emit an ID, and let notified clients fetch the post?
            title: &title,
            content: &content,
        });

        self.posts.push(Post {
            id: self.posts.len(),
            title,
            content,
            comments: Vec::new(),
        });

        match self.posts.last() {
            Some(post) => post,
            None => env::unreachable(),
        }
    }

    pub fn create_comment(
        &mut self,
        post_id: usize,
        user: String, // todo! expose executor identity to app context
        text: String,
    ) -> Option<&Comment> {
        env::log(&format!(
            "Creating comment under post with id: {:?} as user: {:?} with text: {:?}",
            post_id, user, text
        ));

        let post = self.posts.get_mut(post_id)?;

        app::emit!(Event::CommentCreated {
            post_id,
            // todo! should we maybe only emit an ID, and let notified clients fetch the comment?
            user: &user,
            text: &text,
        });

        post.comments.push(Comment { user, text });

        post.comments.last()
    }

    // New Code
    pub fn create_user(&mut self, name: String, profile: String, bio: String) -> &User {
        env::log(&format!(
            "Creating User with name: {:?} and profile: {:?}  and bio: {:?}",
            name, profile, bio
        ));

        app::emit!(Event::UniversalEvent {
            id: self.users.len(),
            // todo! should we maybe only emit an ID, and let notified clients fetch the post?
            event_type: "User",
        });

        self.users.push(User {
            id: self.users.len(),
            name,
            profile,
            bio,
        });

        match self.users.last() {
            Some(user) => user,
            None => env::unreachable(),
        }
    }

    pub fn users(&self) -> &[User] {
        env::log("Getting all posts");
        &self.users
    }

    pub fn get_user(&self, id: usize) -> Option<&User> {
        env::log(&format!("Getting User with id: {:?}", id));
        self.users.get(id)
    }

    pub fn create_conversation(
        &mut self,
        title: String,
        content: String,
        user_id: usize,
    ) -> Option<Conversation> {
        // Check if the user exists in `self.users`
        if self.users.get(user_id).is_none() {
            env::log(&format!("User with id: {:?} does not exist", user_id));
            return None;
        }

        env::log(&format!(
            "Creating conversation with title: {:?} and content: {:?} for user id: {:?}",
            title, content, user_id
        ));

        let conversation = Conversation {
            id: self.users.len(), // Generate a unique ID for the conversation
            title,
            content,
            messages: Vec::new(),
            users: vec![user_id], // Initialize with the verified user ID
        };

        app::emit!(Event::UniversalEvent {
            id: conversation.id,
            event_type: "Conversation",
        });

        Some(conversation)
    }

    pub fn add_user_to_conversation(&mut self, conversation_id: usize, user_id: usize) -> bool {
        // Check if the conversation exists
        let conversation = match self.conversations.get_mut(conversation_id) {
            Some(conversation) => conversation,
            None => {
                env::log(&format!("Conversation with id: {:?} does not exist", conversation_id));
                return false; // Conversation does not exist, return false
            }
        };
    
        // Check if the user exists in `self.users`
        if self.users.get(user_id).is_none() {
            env::log(&format!("User with id: {:?} does not exist", user_id));
            return false; // User does not exist, return false
        }
    
        // Check if the user is already in the conversation
        if conversation.users.contains(&user_id) {
            env::log(&format!(
                "User with id: {:?} is already in the conversation",
                user_id
            ));
            return false; // User is already part of the conversation, return false
        }
    
        // Add the user ID to the conversation
        conversation.users.push(user_id);
        env::log(&format!(
            "User with id: {:?} added to conversation with id: {:?}",
            user_id, conversation.id
        ));
    
        true // User successfully added
    }

    pub fn get_conversations_for_user(&self, user_id: usize) -> Vec<&Conversation> {
        let mut user_conversations = Vec::new();
    
        // Iterate through all conversations
        for conversation in &self.conversations {
            // Check if the user is part of the conversation
            if conversation.users.contains(&user_id) {
                env::log(&format!("User with id: {:?} found in conversation with id: {:?}", user_id, conversation.id));
                user_conversations.push(conversation); // Add to the list if found
            }
        }
    
        if user_conversations.is_empty() {
            env::log(&format!("User with id: {:?} not found in any conversations.", user_id));
        }
    
        user_conversations // Return all conversations that include the user
    }
}
