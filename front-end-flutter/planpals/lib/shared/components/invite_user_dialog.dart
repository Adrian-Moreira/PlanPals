import 'package:flutter/material.dart';

class InviteUserDialog extends StatefulWidget {
  const InviteUserDialog({super.key});

  @override
  _InviteUserDialogState createState() => _InviteUserDialogState();
}

class _InviteUserDialogState extends State<InviteUserDialog> {
  final TextEditingController _usernameController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Invite User'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _usernameController,
              decoration: const InputDecoration(
                labelText: 'Enter username to invite',
              ),
              validator: (value) {
                // Validate username input
                if (value == null || value.isEmpty) {
                  return 'Please enter a username.';
                }
                if (!isUserInDatabase(value)) {
                  return 'No such user found. Please check the username.';
                }
                return null; // No validation errors
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            if (_formKey.currentState?.validate() == true) {
              String username = _usernameController.text;

              // Add your invite logic here
              print('Inviting $username');

              // Close the dialog
              Navigator.of(context).pop();
            }
          },
          child: const Text('Invite'),
        ),
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Cancel'),
        ),
      ],
    );
  }

  // Simulate a method to check if the user exists in the database
  bool isUserInDatabase(String username) {
    // Replace this with your actual database check
    List<String> validUsernames = ['user1@example.com', 'user2@example.com'];
    return validUsernames.contains(username);
  }

  // Simple username validation method
  bool isValidUsername(String username) {
    // Use a regex or a more sophisticated validation if needed
    return RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        .hasMatch(username);
  }
}
