import { EGG_ID } from '../lib/constants';
import { query } from './db';

export interface Mappings { [key: string]: number[] }

export interface Server {
  settings: {
    uuid: string;
    meta: {
      name: string;
      description: string;
    };
    suspended: boolean;
    environment: {
      [key: string]: any;
    };
    invocation: string;
    skip_egg_scripts: boolean;
    build: {
      memory_limit: number;
      swap: number;
      io_weight: number;
      cpu_limit: number;
      threads: string | null;
      disk_space: number;
      oom_disabled: boolean;
    };
    container: {
      image: string;
      oom_disabled: boolean;
      requires_rebuild: boolean;
    };
    allocations: {
      force_outgoing_ip: boolean;
      default: {
        ip: string;
        port: number;
      };
      mappings: Mappings;
    };
    mounts: {
      source: string;
      target: string;
      read_only: boolean;
    }[];
    egg: {
      id: string;
      file_denylist: string[];
    };
  };
  process_configuration: {
    startup: {
      done: string | string[];
      user_interaction: [];
      strip_ansi: boolean;
    };
    stop: {
      type: string;
      value: string;
    };
    configs: {
      parser: string;
      file: string;
      replace: {
        match: string;
        replace_with: string;
      }[];
    }[];
  }
}

const INSTALLATION_SCRIPT = {
  container_image: 'openjdk:8-jdk-slim',
  entrypoint: 'bash',
  script: `#!/bin/ash
  # Paper Installation Script
  #
  # Server Files: /mnt/server
  PROJECT=paper
  
  if [ -n "\${DL_PATH}" ]; then
    echo -e "Using supplied download url: \${DL_PATH}"
    DOWNLOAD_URL=\`eval echo \$(echo \${DL_PATH} | sed -e 's/{{/\${/g' -e 's/}}/}/g')\`
  else
    VER_EXISTS=\`curl -s https://api.papermc.io/v2/projects/\${PROJECT} | jq -r --arg VERSION \$MINECRAFT_VERSION '.versions[] | contains(\$VERSION)' | grep -m1 true\`
    LATEST_VERSION=\`curl -s https://api.papermc.io/v2/projects/\${PROJECT} | jq -r '.versions' | jq -r '.[-1]'\`
  
    if [ "\${VER_EXISTS}" == "true" ]; then
      echo -e "Version is valid. Using version \${MINECRAFT_VERSION}"
    else
      echo -e "Specified version not found. Defaulting to the latest \${PROJECT} version"
      MINECRAFT_VERSION=\${LATEST_VERSION}
    fi
  
    BUILD_EXISTS=\`curl -s https://api.papermc.io/v2/projects/\${PROJECT}/versions/\${MINECRAFT_VERSION} | jq -r --arg BUILD \${BUILD_NUMBER} '.builds[] | tostring | contains(\$BUILD)' | grep -m1 true\`
    LATEST_BUILD=\`curl -s https://api.papermc.io/v2/projects/\${PROJECT}/versions/\${MINECRAFT_VERSION} | jq -r '.builds' | jq -r '.[-1]'\`
  
    if [ "\${BUILD_EXISTS}" == "true" ]; then
      echo -e "Build is valid for version \${MINECRAFT_VERSION}. Using build \${BUILD_NUMBER}"
    else
      echo -e "Using the latest \${PROJECT} build for version \${MINECRAFT_VERSION}"
      BUILD_NUMBER=\${LATEST_BUILD}
    fi
  
    JAR_NAME=\${PROJECT}-\${MINECRAFT_VERSION}-\${BUILD_NUMBER}.jar
  
    echo "Version being downloaded"
    echo -e "MC Version: \${MINECRAFT_VERSION}"
    echo -e "Build: \${BUILD_NUMBER}"
    echo -e "JAR Name of Build: \${JAR_NAME}"
    DOWNLOAD_URL=https://api.papermc.io/v2/projects/\${PROJECT}/versions/\${MINECRAFT_VERSION}/builds/\${BUILD_NUMBER}/downloads/\${JAR_NAME}
  fi
  
  cd /mnt/server
  
  echo -e "Running curl -o \${SERVER_JARFILE} \${DOWNLOAD_URL}"
  
  if [ -f \${SERVER_JARFILE} ]; then
    mv \${SERVER_JARFILE} \${SERVER_JARFILE}.old
  fi
  
  curl -o \${SERVER_JARFILE} \${DOWNLOAD_URL}
  
  if [ ! -f server.properties ]; then
      echo -e "Downloading MC server.properties"
      curl -o server.properties https://raw.githubusercontent.com/parkervcp/eggs/master/minecraft/java/server.properties
  fi`
};

export async function addServer({ uuid, ip, port }: { uuid: string; ip: string; port: number; }) {
  const mappings: Mappings = {};
  mappings[ip] = [port];

  const server: Server = {
    settings: {
      uuid,
      meta: {
        name: 'My server',
        description: '',
      },
      suspended: false,
      environment: {
        SERVER_JARFILE: 'server.jar',
        MC_VERSION: 'latest',
        BUILD_TYPE: 'recommended',
        FORGE_VERSION: '',
        STARTUP: 'java -Xms128M -XX:MaxRAMPercentage=95.0 -Dterminal.jline=false -Dterminal.ansi=true $( [[  ! -f unix_args.txt ]] && printf %s \"-jar {{SERVER_JARFILE}}\" || printf %s \"@unix_args.txt\" )',
        P_SERVER_LOCATION: 'home',
        P_SERVER_UUID: uuid,
        P_SERVER_ALLOCATION_LIMIT: 0
      },
      invocation: 'java -Xms128M -XX:MaxRAMPercentage=95.0 -Dterminal.jline=false -Dterminal.ansi=true $( [[  ! -f unix_args.txt ]] && printf %s \"-jar {{SERVER_JARFILE}}\" || printf %s \"@unix_args.txt\" )',
      skip_egg_scripts: false,
      build: {
        memory_limit: 1024,
        swap: 0,
        io_weight: 500,
        cpu_limit: 0,
        threads: null,
        disk_space: 1024,
        oom_disabled: true
      },
      container: {
        image: 'ghcr.io/pterodactyl/yolks:java_8',
        oom_disabled: true,
        requires_rebuild: false
      },
      allocations: {
        force_outgoing_ip: false,
        default: {
          ip,
          port
        },
        mappings
      },
      mounts: [],
      egg: {
        id: EGG_ID,
        file_denylist: []
      }
    },
    process_configuration: {
      startup: {
        done: [')! For help, type '],
        user_interaction: [],
        strip_ansi: false
      },
      stop: {
        type: 'command',
        value: 'stop'
      },
      configs: [
        {
          parser: 'properties',
          file: 'server.properties',
          replace: [
            {
              match: 'server-ip',
              replace_with: '0.0.0.0'
            },
            {
              match: 'server-port',
              replace_with: port.toString()
            },
            {
              match: 'query.port',
              replace_with: port.toString()
            }
          ]
        }
      ]
    }
  };

  await query('INSERT INTO servers (uuid, data, installation) VALUES(?, ?, ?)', [
    uuid,
    JSON.stringify(server),
    JSON.stringify(INSTALLATION_SCRIPT),
  ]);

  return server;
}

export async function getServer(uuid: string) {
  const server = await query('SELECT data FROM servers WHERE uuid=?', [uuid]);
  if (!server.length) return null;
  return JSON.parse(server[0].data);
}

export async function getServerInstallation(uuid: string) {
  const installation = await query('SELECT installation FROM servers WHERE uuid=?', [uuid]);
  if (!installation.length) return null;
  return JSON.parse(installation[0].installation);
}

export async function getServers(page?: number, limit?: number) {
  const servers = await query(`SELECT data FROM servers LIMIT ${limit || 100} OFFSET ${(limit || 100) * (page || 0)}`);
  return servers.map(({ data }: { data: string }) => {
    const parsedData = JSON.parse(data) as Server;
    return {
      ...parsedData,
      uuid: parsedData.settings.uuid,
    }
  })
}

export async function getServerCount() {
  return (await query('SELECT COUNT(*) FROM servers'))[0]['COUNT(*)'] as number;
}
