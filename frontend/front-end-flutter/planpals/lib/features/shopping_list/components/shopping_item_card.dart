import 'package:flutter/material.dart';
import 'package:planpals/features/shopping_list/models/shopping_item_model.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/components/generic_card.dart';
import 'package:provider/provider.dart';

class ShoppingItemCard extends StatelessWidget {
  final ShoppingItem item;
  final bool functional;

  const ShoppingItemCard(
      {super.key, required this.item, required this.functional});

  @override
  Widget build(BuildContext context) {
    ShoppingListViewModel viewModel =
        Provider.of<ShoppingListViewModel>(context);

    return GenericCard(
      title: Text(item.name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Location: ${item.location}'),
          Text('Added By: ${item.addedBy}'),
        ],
      ),
      onDelete: () {
        showDialog(
            context: context,
            builder: (context) => DeleteMessage(onDelete: () {
                  viewModel.deleteShoppingItemFromShoppingList(
                      viewModel.currentShoppingList!, item);

                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text(
                        viewModel.errorMessage ?? 'Item deleted successfully!'),
                  ));
                }));
      },
      onEdit: () {
        // TODO: Add edit functionality
      },
      functional: false,
      voteable: false,
      commentable: false,
    );
  }
}
