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
            version = "2.1.0";

            src = ./.;

            nativeBuildInputs = [ pkgs.zip ];

            buildPhase = ''
              zip -r custom-tab-title-favicon.xpi \
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

      defaultPackage = forAllSystems (system: self.packages.${system}.firefox-addon);
    };
}
