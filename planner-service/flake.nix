{
  description = "PlanPals!!!";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { self
    , nixpkgs
    , flake-utils
    }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      defaultPackage = pkgs.buildNpmPackage {
        name = "planner-service";
        src = ./.;
        nativeBuildInputs = with pkgs; [
          nodejs_20
          typescript
        ];
        npmBuildScript = "build";
        npmDepsHash = "sha256-xHK6yVxT0+YbNHn3VwFegbahlIvYxHjBT71jlE8ESZI=";
        nodejs = pkgs.nodejs_20;
      };
    in
    {
      packages = {
        default = defaultPackage;
      };
      app = {
        default = defaultPackage;
      };
      devShells = {
        default = pkgs.mkShell {
          buildInputs = with pkgs; [
            git
            nodejs_20
            typescript
            nodePackages.ts-node
            typescript-language-server
            prefetch-npm-deps
          ];
        };
      };
      formatter = pkgs.nixpkgs-fmt;
    });
}
