import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/destination_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/transport_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/destination_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/transport_card.dart';
import 'package:planpals/shared/components/error_message_screen.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/constants/constants.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class PlannerDetailsView extends StatelessWidget {
  final Planner travelPlanner;

  const PlannerDetailsView({super.key, required this.travelPlanner});

  @override
  Widget build(BuildContext context) {
    return
        // check if travelPlanner is null
        // ignore: unnecessary_null_comparison
        travelPlanner == null
            // if null, display error message for null travel planner
            ? ErrorMessageScreen(
                errorMessage: ErrorMessage.nullPlanner,
                appBarTitle: '',
              )

            // else display travel planner details
            : _buildPlanner(context, travelPlanner);
  }

  Widget _buildPlanner(BuildContext context, Planner planner) {
    // User? user = Provider.of<UserViewModel>(context).currentUser;
    User user = MockDataBase.user;
    // PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
    // plannerViewModel.fetchAllDestinations(planner.plannerId);
    // plannerViewModel.fetchAllTransports(planner.plannerId);

    List<Transport> transports = [
      Transport(
          transportationId: '',
          plannerId: '',
          type: 'Flight',
          details: 'Flight to someehere',
          departureTime: DateTime.now(),
          arrivalTime: DateTime.now())
    ];
    List<Destination> destinations = MockDataBase.destinations;

    // bool functional = travelPlanner.rwUsers.contains(user!.id);
    bool functional = true;

    return Scaffold(
      appBar: AppBar(
        actions: <Widget>[
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu),
            onSelected: (String result) {
              // Handle menu item selection
              print('Selected: $result');
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'Profile',
                child: Text('Profile'),
              ),
              const PopupMenuItem<String>(
                value: 'Settings',
                child: Text('Settings'),
              ),
              const PopupMenuItem<String>(
                value: 'Logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: CustomScrollView(
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
                      travelPlanner.name,
                      style: const TextStyle(fontSize: 30),
                    ),
                    subtitle: Text(
                        '${DateTimeFormat.formatDate(travelPlanner.startDate)} - ${DateTimeFormat.formatDate(travelPlanner.endDate)}'),
                    trailing: IconButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  const InviteUserDialog()), // navigate to travel planners
                        );
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
                        borderRadius:
                            BorderRadius.circular(8), // Rounded corners
                      ),
                      child: const Icon(
                        Icons.calendar_month,
                        size: 30, // Icon size // Icon color
                      ),
                    ),
                    title: Text(
                        '${travelPlanner.endDate.difference(travelPlanner.startDate).inDays} Days'),
                    subtitle: Text(
                        '${travelPlanner.destinations.length} destinations'),
                  ),
                  ListTile(
                    leading: Container(
                      padding:
                          const EdgeInsets.all(10), // Padding around the icon
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
                    title: const Text('Members'),
                    subtitle: const Text('Todo: List # of members or names'),
                  ),
                  GenericListView(
                    itemList: destinations,
                    itemBuilder: (destination) => DestinationCard(
                      destination: destination,
                      onEdit: () {},
                      onDelete: () {},
                      functional: functional,
                    ),
                    onAdd: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => DestinationForm(
                                  plannerId: planner.plannerId)));
                    },
                    headerTitle: "Destinations",
                    headerIcon: Icons.landscape,
                    emptyMessage: "There is no destination",
                    functional: functional,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  const Divider(height: 1),
                  const SizedBox(
                    height: 10,
                  ),
                  GenericListView(
                    itemList: transports,
                    itemBuilder: (transport) => TransportCard(
                      transport: transport,
                      onEdit: () {},
                      onDelete: () {},
                      functional: functional,
                    ),
                    onAdd: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => TransportForm(
                                    plannerId: travelPlanner.plannerId,
                                  )));
                    },
                    headerTitle: "Transportations",
                    headerIcon: Icons.emoji_transportation,
                    emptyMessage: "There is no transportation",
                    functional: functional,
                  ),
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
      ),
    );
  }
}
