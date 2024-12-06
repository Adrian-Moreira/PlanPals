import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_destination_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/create/create_transport_form.dart';
import 'package:planpals/shared/styles/background.dart';
import 'package:planpals/shared/styles/app_styles.dart';
import 'package:provider/provider.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/cards/destination_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/transport_card.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class PlannerDetailsView extends StatefulWidget {
  final Planner travelPlanner;

  const PlannerDetailsView({super.key, required this.travelPlanner});

  @override
  State<PlannerDetailsView> createState() => _PlannerDetailsViewState();
}

class _PlannerDetailsViewState extends State<PlannerDetailsView> {
  User? user;
  bool functional = false;

  late final Planner planner;

  @override
  void initState() {
    super.initState();
    planner = widget.travelPlanner;
    user = Provider.of<UserViewModel>(context, listen: false)
        .currentUser; // get user from provider
    fetchData();

    functional = planner.rwUsers.contains(user!.id);
  }

  Future<void> _handleOnInviteUser(String userId) async {
    await Provider.of<PlannerViewModel>(context, listen: false)
        .inviteUserToPlanner(planner.plannerId, userId);
  }

  Future<void> fetchData() async {
    await Provider.of<PlannerViewModel>(context, listen: false)
        .fetchDestinationsAndTransportsByPlannerId(
            widget.travelPlanner.plannerId, user!.id);
  }

  @override
  Widget build(BuildContext context) {
    return Background(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: const NavigatorAppBar(title: "Travel Planner Details"),
        body: _buildPlanner(context, widget.travelPlanner),
      ),
    );
  }

  Widget _buildPlanner(BuildContext context, Planner planner) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);

    List<Destination> destinations = plannerViewModel.destinations;
    List<Transport> transportations = plannerViewModel.transports;

    return plannerViewModel.isLoading
        ? const Center(child: CircularProgressIndicator())
        : CustomScrollView(
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
                          widget.travelPlanner.name,
                          style: TextStyles.titleLarge,
                        ),
                        subtitle: Text(
                            '${DateTimeFormat.formatDate(widget.travelPlanner.startDate)} - ${DateTimeFormat.formatDate(widget.travelPlanner.endDate)}',
                            style: const TextStyle(fontSize: 18, color: Color.fromARGB(200, 255, 255, 255))),
                        trailing: IconButton(
                          onPressed: () {
                            showDialog(
                                context: context,
                                builder: (context) => InviteUserDialog(
                                    // TODO: Add invite functionality
                                    onInvite: _handleOnInviteUser
                                    ));
                          },
                          icon: const Icon(
                            Icons.group_add,
                            size: 40,
                            color: Color.fromARGB(255, 255, 255, 255),
                          ),
                        ),
                      ),
                      ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(
                              10), // Padding around the icon
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 223, 223, 223), // Background color
                            borderRadius:
                                BorderRadius.circular(8), // Rounded corners
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
                        subtitle: Text(widget.travelPlanner.description, style: TextStyles.subtitleMedium),
                      ),
                      ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(
                              10), // Padding around the icon
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(
                                255, 223, 223, 223), // Background color
                            borderRadius:
                                BorderRadius.circular(8), // Rounded corners
                          ),
                          child: const Icon(
                            Icons.calendar_month,
                            size: 30, // Icon size // Icon color
                          ),
                        ),
                        title: Text(
                          '${widget.travelPlanner.endDate.difference(widget.travelPlanner.startDate).inDays} Days',
                          style: TextStyles.titleSmall,
                        ),
                        subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${destinations.length} Destinations', style: TextStyles.subtitleSmall),
                              Text('${transportations.length} Transportations', style: TextStyles.subtitleSmall),
                            ]),
                      ),
                      ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(
                              10), // Padding around the icon
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(
                                255, 223, 223, 223), // Background color
                            borderRadius:
                                BorderRadius.circular(8), // Rounded corners
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
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                                '${planner.rwUsers.length} Members', style: TextStyles.subtitleMedium),
                          ],
                        ),
                      ),
                      
                      _buildDestinationList(destinations),

                      const SizedBox(
                        height: 20,
                      ),
                      const Divider(height: 1),
                      const SizedBox(
                        height: 10,
                      ),
                      
                      _buildTransportationList(transportations),

                      const SizedBox(
                        height: 20,
                      ),
                      const Divider(height: 1),
                      const SizedBox(
                        height: 10,
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
  }

  Widget _buildDestinationList(List<Destination> destinations) {
    return GenericListView(
      itemList: destinations,
      itemBuilder: (destination) => DestinationCard(
        destination: destination,
        functional: functional,
      ),
      onAdd: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => CreateDestinationForm(planner: planner)));
      },
      headerTitle: "Destinations",
      headerIcon: Icons.landscape,
      emptyMessage: "There is no destination",
      functional: functional,
      headerColor: Colors.white,
    );
  }

  Widget _buildTransportationList(List<Transport> transportations) {
    return GenericListView(
      itemList: transportations,
      itemBuilder: (transportation) => TransportCard(
        transport: transportation,
        functional: functional,
      ),
      onAdd: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => CreateTransportForm(planner: planner)));
      },
      headerTitle: "Transportations",
      headerIcon: Icons.emoji_transportation,
      emptyMessage: "There is no transportation",
      functional: functional,
      scrollable: false,
      headerColor: Colors.white,
    );
  }
}
