{
  description = "Custom Tab Title Firefox Add-on (Nix build + policy install)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in {
      packages = forAllSystems (system:
        let pkgs = import nixpkgs { inherit system; };
        in {
          firefox-addon = pkgs.stdenv.mkDerivation {
            pname = "custom-tab-title-favicon";
            version = "2.1.1";

            src = ./.;

            nativeBuildInputs = [ pkgs.zip ];

            buildPhase = ''
              zip -r custom-tab-title-favicon.xpi \
                title-rules.js \
                apply-rules.js \
                manifest.json \
                options \
                icons \
                example.json
            '';

            installPhase = ''
              mkdir -p $out
              cp custom-tab-title-favicon.xpi $out/
            '';
          };
        });

      checks = forAllSystems (system:
        let pkgs = import nixpkgs { inherit system; };
        in {
          title-rules = pkgs.runCommand "title-rules-test" { nativeBuildInputs = [ pkgs.nodejs ]; } ''
            cp ${./title-rules.js} title-rules.js
            cp ${./title-rules.test.js} title-rules.test.js
            node --test title-rules.test.js
            touch $out
          '';
        });

      devShells = forAllSystems (system:
        let pkgs = import nixpkgs { inherit system; };
        in {
          default = pkgs.mkShell { packages = [ pkgs.nodejs pkgs.zip ]; };
        });

      defaultPackage = forAllSystems (system: self.packages.${system}.firefox-addon);
    };
}
