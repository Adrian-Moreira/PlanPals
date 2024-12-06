import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_planner_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/planner_card.dart';
import 'package:planpals/shared/styles/background.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:planpals/shared/network/ws_provider.dart';
import 'package:planpals/shared/network/ws_service.dart';
import 'package:provider/provider.dart';

class PlannersView extends StatefulWidget {
  const PlannersView({super.key});

  @override
  _PlannersViewState createState() => _PlannersViewState();
}

class _PlannersViewState extends State<PlannersView> {
  late WebSocketProvider wsProvider;
  late PlannerViewModel plannerViewModel;
  late User user;

  void _onWebSocketMessage() {
    final messages = wsProvider.messages;
    bool updated = false;

    for (var msg in messages.values) {
      if (msg.message.type == 'planner') {
        if (msg.action == 'update') {
          final plannerData = msg.message.data;
          final plannerId = plannerData['_id'];
          final index = plannerViewModel.planners
              .indexWhere((p) => p.plannerId == plannerId);
          if (index != -1) {
            plannerViewModel.planners[index] = Planner.fromJson(plannerData);
          } else {
            plannerViewModel.planners.add(Planner.fromJson(plannerData));
          }
          updated = true;
        } else if (msg.action == 'delete') {
          final plannerId = msg.message.data['_id'];
          plannerViewModel.planners
              .removeWhere((p) => p.plannerId == plannerId);
          updated = true;
        }
      }
    }
    wsProvider.messages.clear();

    if (updated) {
      plannerViewModel.notifyListeners();
    }
  }

  @override
  void dispose() {
    // Unsubscribe from the 'planners' topic and remove listener
    final topic = MessageTopic(type: TopicType.planners, id: user.id);
    wsProvider.unsubscribe([topic]);
    wsProvider.removeListener(_onWebSocketMessage);
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    // Fetch planners when the widget is first created
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
      plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
      await plannerViewModel.fetchPlannersByUserId(user.id);

      wsProvider = Provider.of<WebSocketProvider>(context, listen: false);
      final topic = MessageTopic(type: TopicType.planners, id: user.id);
      wsProvider.subscribe([topic]);
      wsProvider.addListener(_onWebSocketMessage);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Background(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: const NavigatorAppBar(title: "Travel Planners"),
        body: _buildPlannerList(context),
        floatingActionButton: Padding(
          padding: const EdgeInsets.only(bottom: 30.0, right: 20.0),
          child: SizedBox(
            width: 70.0,
            height: 70.0,
            child: FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const CreatePlannerForm()),
                );
              },
              tooltip: 'Add Travel Planner',
              child: const Icon(Icons.add, size: 50.0),
            ),
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      ),
    );
  }

  Widget _buildPlannerList(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);

    return plannerViewModel.isLoading
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            child: GenericListView(
              itemList: plannerViewModel.planners,
            itemBuilder: (planner) => PlannerCard(
                travelPlanner: planner,
              ),
              onAdd: () {},
              headerTitle: "My Travel Planners",
              headerIcon: Icons.airplanemode_active,
              emptyMessage: "There are no travel planners",
              functional: false,
              scrollable: true,
              headerColor: Colors.white,
            ),
          );
  }
}
