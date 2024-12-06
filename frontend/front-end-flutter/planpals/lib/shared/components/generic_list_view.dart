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
  final Color? headerColor;
  final bool? showHeader;
  final bool? showEmptyMessage;

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
    this.headerColor,
    this.showHeader = true,
    this.showEmptyMessage = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      showHeader == false
          ? const SizedBox()
          : ListTile(
              leading: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(headerIcon,
                      size: headerIconSize ?? 35,
                      color: headerColor ?? Colors.black),
                  const SizedBox(width: 15),
                  Text(headerTitle,
                      style: headerStyle ??
                          TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.bold,
                            color: headerColor ?? Colors.black,
                          )),
                ],
              ),
              trailing: functional
                  ? IconButton(
                      onPressed: onAdd,
                      icon: Icon(
                        Icons.add_circle,
                        size: headerIconSize ?? 35,
                      ),
                      color: headerColor ?? Colors.black,
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
      return showEmptyMessage == false
          ? const SizedBox()
          : Column(
              children: [
                const SizedBox(height: 5),
                Text(
                  emptyMessage,
                  style: TextStyle(
                      fontSize: 20,
                      color: headerColor ??
                          const Color.fromARGB(255, 100, 100, 100)),
                ),
              ],
            );
    }
  }
}
