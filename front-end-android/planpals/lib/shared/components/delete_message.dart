import 'package:flutter/material.dart';

class DeleteMessage extends StatelessWidget {
  final VoidCallback onDelete;

  const DeleteMessage({Key? key, required this.onDelete}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Delete Confirmation'),
      content: Text('Are you sure you want to proceed?'),
      actions: [
        TextButton(
          onPressed: () {
            // Handle "No" action
            Navigator.pop(context); // Close the dialog
          },
          child: Text('No'),
        ),
        TextButton(
          onPressed: () {
            onDelete;
            print('Yes pressed');
            Navigator.pop(context); // Close the dialog
          },
          child: Text('Yes'),
        ),
      ],
    );
  }
}
