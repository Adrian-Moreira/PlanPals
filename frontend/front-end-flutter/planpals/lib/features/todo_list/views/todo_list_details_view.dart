import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/todo_list/views/components/todo_task_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:provider/provider.dart';

class TodoListDetailsView extends StatefulWidget {
  final TodoList todoList;

  const TodoListDetailsView({super.key, required this.todoList});

  @override
  State<TodoListDetailsView> createState() => _TodoListDetailsViewState();
}

class _TodoListDetailsViewState extends State<TodoListDetailsView> {
  late final TodoList todoList;
  late User user;
  bool functional = false;

  @override
  void initState() {
    super.initState();
    todoList = widget.todoList;
    user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
    functional = todoList.rwUsers.contains(user.id);

    _fetchData();
  }

  Future<void> _fetchData() async {
    await Provider.of<TodoListViewModel>(context, listen: false)
        .fetchTodoTasksByTodoListId(todoList.id, user.id);
  }

  Future<void> _handleOnInviteUser(String userId) async {
    // await Provider.of<TodoListViewModel>(context, listen: false)
    //     .inviteUserToShoppingList(shoppingList.id, userId);

    // setState(() {
    //   shoppingList = Provider.of<ShoppingListViewModel>(context, listen: false)
    //       .currentShoppingList!;
    // });
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }

  Widget _buildPage(BuildContext context) {
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
                    todoList.name,
                    style: const TextStyle(fontSize: 30),
                  ),
                  trailing: IconButton(
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (context) => InviteUserDialog(
                              // TODO: Add invite functionality

                              // onInvite: _handleOnInviteUser));
                              ));
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
                  subtitle: Text(todoList.description!),
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
                  subtitle: Text('${todoList.rwUsers.length} members'),
                ),
                const SizedBox(
                  height: 20,
                ),
                const Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),
                _buildTaskList(context),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTaskList(BuildContext context) {
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    List<TodoTask> tasks = Provider.of<TodoListViewModel>(context).todoTasks;

    var functional = todoList.rwUsers.contains(user.id);

    return GenericListView(
      itemList: tasks,
      itemBuilder: (task) => TodoTaskCard(
        todoTask: task,
        // functional: functional,
      ),
      headerTitle: "Tasks",
      headerIcon: Icons.list_alt,
      emptyMessage: "There is no task",
      functional: functional,
      onAdd: () {},
    );
  }
}
