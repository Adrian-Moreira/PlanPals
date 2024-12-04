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
  final TextStyle? headerStyle;
  final double? headerIconSize;

  const GenericListView({
    super.key,
    required this.itemList,
    required this.itemBuilder,
    required this.onAdd,
    required this.headerTitle,
    required this.headerIcon,
    required this.emptyMessage,
    this.functional = false, // true if there is an Add button, false if not.
    this.scrollable = false,
    this.headerStyle,
    this.headerIconSize, // true if the list is scrollable, false if not.
  });

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      ListTile(
        leading: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(headerIcon, size: headerIconSize ?? 35),
            const SizedBox(width: 15),
            Text(headerTitle,
                style: headerStyle ??
                    const TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.bold,
                    )),
          ],
        ),
        trailing: functional
            ? IconButton(
                onPressed: onAdd,
                icon: Icon(Icons.add_circle, size: headerIconSize ?? 35,
                ),
              )
            : null,
      ),
      buildList(context),
    ]);
  }

  Widget buildList(BuildContext context) {
    if (itemList.isNotEmpty) {
      return ListView.builder(
          shrinkWrap: true,
          physics: scrollable
              ? const ScrollPhysics()
              : const NeverScrollableScrollPhysics(),
          itemCount: itemList.length,
          itemBuilder: (context, index) {
            return itemBuilder(
              itemList[index],
            ); 
          });
    } else {
      return Column(
        children: [
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
