import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:provider/provider.dart';

class InviteUserDialog extends StatefulWidget {
  final Function(String)? onInvite;

  const InviteUserDialog({super.key, required this.onInvite});

  @override
  _InviteUserDialogState createState() => _InviteUserDialogState();
}

class _InviteUserDialogState extends State<InviteUserDialog> {
  final TextEditingController _usernameController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  late User _userToInvite;

  bool _isCheckingUsername = false;
  String? _usernameError;

  @override
  void dispose() {
    _usernameController.dispose();
    super.dispose();
  }

  Future<void> validateUsername(UserViewModel viewModel) async {
    setState(() {
      _isCheckingUsername = true;
      _usernameError = null;
    });

    String username = _usernameController.text;

    // Check if the user exists in the database
    User? fetchedUser = await viewModel.fetchUserByUserName(username);

    if (fetchedUser == null) {
      setState(() {
        _usernameError = 'User not found.';
      });
    }

    setState(() {
      _isCheckingUsername = false;
    });

    _userToInvite = fetchedUser!;
  }

  @override
  Widget build(BuildContext context) {
    UserViewModel userViewModel =
        Provider.of<UserViewModel>(context, listen: false);

    return AlertDialog(
      title: const Text('Invite User'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _usernameController,
              decoration: InputDecoration(
                labelText: 'Enter username to invite',
                errorText: _usernameError,
                suffixIcon: _isCheckingUsername
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : null,
              ),
              onChanged: (value) {
                // Clear error message on input change
                if (_usernameError != null) {
                  setState(() {
                    _usernameError = null;
                  });
                }
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a username.';
                }
                return null;
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () async {
            if (_formKey.currentState?.validate() == true) {
              await validateUsername(userViewModel);

              if (_usernameError == null) {
                String username = _usernameController.text;

                // Trigger the onInvite callback
                widget.onInvite?.call(_userToInvite.id);

                ScaffoldMessenger.of(context)
                    .showSnackBar(SnackBar(content: Text('Invited $username successfully!')));
                // Close the dialog
                Navigator.of(context).pop();
              }
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
}
