import 'package:flutter/material.dart';

class GenericListView<T> extends StatelessWidget {
  final List<T> itemList;
  final Widget Function(T) itemBuilder;
  final VoidCallback onAdd;
  final String headerTitle;
  final IconData headerIcon;
  final String emptyMessage;
  final bool functional;
  final bool scrollable;

  const GenericListView({
    super.key, 
    required this.itemList,
    required this.itemBuilder,
    required this.onAdd,
    required this.headerTitle,
    required this.headerIcon,
    required this.emptyMessage,
    this.functional = false,  // true if there is an Add button, false if not.
    this.scrollable = false,   // true if the list is scrollable, false if not.
  });

  @override
  Widget build(BuildContext context) {
    if (itemList.isNotEmpty) {
    return ListView.builder(
      shrinkWrap: true,
      physics:  scrollable ? const ScrollPhysics() : const NeverScrollableScrollPhysics(),
      itemCount: itemList.length + 1, // increment by 1 for the header
      itemBuilder: (context, index) {
        if (index == 0) {
          // return the header for the list
          return ListTile(
            leading: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(headerIcon, size: 35),
                SizedBox(width: 15),
                Text(
                  headerTitle,
                  style: const TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            trailing: functional
                ? IconButton(
                    onPressed: onAdd,
                    icon: const Icon(
                      Icons.add_circle,
                      size: 30,
                    ),
                  )
                : null,
          );
        } else {
          // return the list of items
          return itemBuilder(
            itemList[index - 1],
          ); // Adjust index because 0 is used for header
        }
      },
    );
  } else {
    // return the header and a message that there's no item
    return Column(
      children: [
        ListTile(
          leading: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                headerIcon,
                size: 35,
              ),
              SizedBox(width: 15),
              Text(
                headerTitle,
                style: const TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          trailing: functional
              ? IconButton(
                  onPressed: onAdd,
                  icon: const Icon(
                    Icons.add_circle,
                    size: 30,
                  ),
                )
              : null,
        ),
        const SizedBox(height: 5),
        Text(
          emptyMessage,
          style: const TextStyle(fontSize: 20),
        ),
      ],
    );
  }
  }
}
