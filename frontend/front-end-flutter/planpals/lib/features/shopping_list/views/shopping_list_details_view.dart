import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/shopping_list/components/create_shopping_item_form.dart';
import 'package:planpals/features/shopping_list/components/shopping_item_card.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:provider/provider.dart';

class ShoppingListDetailsView extends StatefulWidget {
  final ShoppingList shoppingList;

  const ShoppingListDetailsView({super.key, required this.shoppingList});

  @override
  State<ShoppingListDetailsView> createState() =>
      _ShoppingListDetailsViewState();
}

class _ShoppingListDetailsViewState extends State<ShoppingListDetailsView> {
  late ShoppingList shoppingList;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    setState(() {
      shoppingList = Provider.of<ShoppingListViewModel>(context, listen: false)
          .currentShoppingList!;
    });
  }

  @override
  void initState() {
    super.initState();

    shoppingList = widget.shoppingList;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      setState(() {
        shoppingList =
            Provider.of<ShoppingListViewModel>(context, listen: false)
                .currentShoppingList!;
      });
    });
  }

  Future<void> _handleOnInviteUser(String userId) async {
    await Provider.of<ShoppingListViewModel>(context, listen: false)
        .inviteUserToShoppingList(shoppingList.id, userId);

    setState(() {
      shoppingList = Provider.of<ShoppingListViewModel>(context, listen: false)
          .currentShoppingList!;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavigatorAppBar(title: "Shopping List Details"),
      body: _buildList(context),
    );
  }

  Widget _buildList(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Sliver app bar
        // const SliverAppBar(
        //   expandedHeight: 250.0,
        //   flexibleSpace: FlexibleSpaceBar(
        //     background: Icon(
        //       Icons.image,
        //       size: 200,
        //     ),
        //     centerTitle: true,
        //   ),
        //   backgroundColor: Color.fromRGBO(122, 22, 124, 1.0),
        // ),

        SliverToBoxAdapter(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  title: Text(
                    shoppingList.name,
                    style: const TextStyle(fontSize: 30),
                  ),
                  trailing: IconButton(
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (context) => InviteUserDialog(
                              // TODO: Add invite functionality

                              onInvite: _handleOnInviteUser));
                    },
                    icon: const Icon(
                      Icons.group_add,
                      size: 40,
                    ),
                  ),
                ),
                ListTile(
                  leading: Container(
                    padding:
                        const EdgeInsets.all(10), // Padding around the icon
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(
                          255, 223, 223, 223), // Background color
                      borderRadius: BorderRadius.circular(8), // Rounded corners
                    ),
                    child: const Icon(
                      Icons.description,
                      size: 30, // Icon size // Icon color
                    ),
                  ),
                  title: const Text(
                    'Description',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(shoppingList.description!),
                ),
                ListTile(
                  leading: Container(
                    padding:
                        const EdgeInsets.all(10), // Padding around the icon
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(
                          255, 223, 223, 223), // Background color
                      borderRadius: BorderRadius.circular(8), // Rounded corners
                    ),
                    child: const Icon(
                      Icons.group_rounded,
                      size: 30, // Icon size // Icon color
                    ),
                  ),
                  title: const Text(
                    'Members',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text('${shoppingList.rwUsers!.length} members'),
                ),
                const SizedBox(
                  height: 20,
                ),
                const Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),
                _buildItemList(context),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildItemList(BuildContext context) {
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    var functional = shoppingList.rwUsers?.contains(user.id);

    return GenericListView(
      itemList: shoppingList.items!,
      itemBuilder: (item) => ShoppingItemCard(
        item: item,
        functional: functional,
      ),
      headerTitle: "Items",
      headerIcon: Icons.list_alt,
      emptyMessage: "There is no item",
      functional: functional!,
      onAdd: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CreateShoppingItemForm(
              shoppingList: shoppingList,
            ),
          ),
        ).then((_) {
          setState(() {
            shoppingList =
                Provider.of<ShoppingListViewModel>(context, listen: false)
                    .currentShoppingList!;
          });
        });
      },
    );
  }
}
