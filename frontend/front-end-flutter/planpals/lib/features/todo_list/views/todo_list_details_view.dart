import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/todo_list/views/components/create_todo_task_form.dart';
import 'package:planpals/features/todo_list/views/components/todo_task_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:planpals/shared/styles/app_styles.dart';
import 'package:planpals/shared/styles/background.dart';
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
    await Provider.of<TodoListViewModel>(context, listen: false)
        .inviteUserToTodoList(todoList.id, userId);
  }

  @override
  Widget build(BuildContext context) {
    return Background(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: const NavigatorAppBar(title: "Todo List Details"),
        body: _buildPage(context),
      ),
    );
  }

  Widget _buildPage(BuildContext context) {
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    List<TodoTask> tasks = Provider.of<TodoListViewModel>(context).todoTasks;

    List<TodoTask> completedTasks =
        tasks.where((task) => task.isCompleted).toList();
    List<TodoTask> uncompletedTasks =
        tasks.where((task) => !task.isCompleted).toList();

    var functional = todoList.rwUsers.contains(user.id);

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
                const SizedBox(
                  height: 10,
                ),
                ListTile(
                  title: Text(
                    todoList.name,
                    style: TextStyles.titleLarge,
                  ),
                  trailing: IconButton(
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (context) =>
                              InviteUserDialog(onInvite: _handleOnInviteUser));
                    },
                    icon: const Icon(
                      Icons.group_add,
                      size: 40,
                      color: Colors.white,
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
                    style: TextStyles.titleSmall,
                  ),
                  subtitle: Text(todoList.description!,
                      style: TextStyles.subtitleMedium),
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
                    style: TextStyles.titleSmall,
                  ),
                  subtitle: Text('${todoList.rwUsers.length} members',
                      style: TextStyles.subtitleMedium),
                ),
                const SizedBox(
                  height: 20,
                ),
                const Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),
                _buildTaskList(context, uncompletedTasks, functional, true),

                const SizedBox(
                  height: 10,
                ),
                Divider(height: 1),
                const SizedBox(
                  height: 10,
                ),

                _buildTaskList(context, completedTasks, functional, false),
                const SizedBox(
                  height: 10,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTaskList(BuildContext context, List<TodoTask> tasks,
      bool functional, bool showHeader) {
    tasks.sort((a, b) => a.dueDate.compareTo(b.dueDate));

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
      onAdd: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CreateTodoTaskForm(todoList: todoList),
          ),
        );
      },
      headerColor: Colors.white,
      showHeader: showHeader,
    );
  }
}
