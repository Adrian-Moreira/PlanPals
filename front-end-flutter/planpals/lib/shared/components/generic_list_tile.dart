import 'package:flutter/material.dart';

class GenericListTile extends StatelessWidget {
  final Widget title;
  final Widget subtitle;
  final Widget? extraInfo;
  final VoidCallback onDelete;
  final VoidCallback onEdit;

  const GenericListTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onDelete,
    required this.onEdit,
    this.extraInfo,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: _buildTitleRow(),
      subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        subtitle,
        _buildVoteButtons(),
        extraInfo ?? Container(),
      ]),
    );
  }

  Widget _buildTitleRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Display the title
        title,

        // Add a popup menu button for editing and deleting
        PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert),
          onSelected: (String result) {
            if (result == 'Edit') {
              onEdit();
            } else if (result == 'Delete') {
              onDelete();
            }
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            const PopupMenuItem<String>(
              value: 'Edit',
              child: Text('Edit'),
            ),
            const PopupMenuItem<String>(
              value: 'Delete',
              child: Text('Delete'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildVoteButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        IconButton(
          icon: Icon(Icons.thumb_up),
          onPressed: () {},
        ),
        Text('2'),
        SizedBox(width: 10),
        IconButton(
          icon: Icon(Icons.thumb_down),
          onPressed: () {},
        ),
        Text('0'),
      ],
    );
  }
}
