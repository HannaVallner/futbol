from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import urllib.request
from bs4 import BeautifulSoup
import urllib.parse

app = Flask(__name__, static_folder='../client/dist/client/browser', static_url_path='')
#app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
     return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/team-info', methods=['GET'])
def get_team_info():
    team_name = request.args.get('team_name')
    if not team_name:
        return jsonify({'error': 'No team name provided'}), 400

    base_search_url = "https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?"
    search_query = urllib.parse.urlencode({'query': team_name})
    search_url = base_search_url + search_query
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    # Request the search results page
    search_request = urllib.request.Request(search_url, headers=headers)
    response = urllib.request.urlopen(search_request)
    html_content = response.read()
    soup = BeautifulSoup(html_content, 'lxml')
    
    clubs_section = soup.find('h2', class_='content-box-headline', string=lambda x: 'Clubs' in x)
    if not clubs_section:
        return jsonify({'error': 'Team not found'}), 404

    clubs_table = clubs_section.find_next('table')
    first_team_link = clubs_table.find('a', title=lambda x: x and team_name.lower() in x.lower())['href']
    team_url = "https://www.transfermarkt.com" + first_team_link

    # Request the team page
    team_request = urllib.request.Request(team_url, headers=headers)
    response = urllib.request.urlopen(team_request)
    html_content = response.read()
    soup = BeautifulSoup(html_content, 'lxml')
    tbodies = soup.find_all('tbody')

    squad = []
    for tbody in tbodies:
        rows = tbody.find_all('tr', class_=['even', 'odd'])
        for row in rows:
            player_number = row.find('div', class_='rn_nummer').get_text(strip=True)
            name = row.find('td', class_='hauptlink').get_text(strip=True)
            position = row.find_all('td')[4].get_text(strip=True)
            age = row.find_all('td')[5].get_text(strip=True)
            country = row.find('img', class_='flaggenrahmen').get('title')
            transfer_info = row.find('span', class_='wechsel-kader-wappen hide-for-small')
            transfer_team = transfer_info.find('a')['title'] if transfer_info else None
            squad.append({
                'player_number': player_number,
                'name': name,
                'position': position,
                'age': age,
                'country': country,
                'transfer_team': transfer_team
            })

    # Transfers Info
    transfers = []
    transfers_link = soup.find('a', href=lambda href: href and 'saison_id' in href)
    if transfers_link:
        transfers_url = "https://www.transfermarkt.com" + transfers_link['href']

        # Request the transfers page
        transfers_request = urllib.request.Request(transfers_url, headers=headers)
        response = urllib.request.urlopen(transfers_request)
        html_content = response.read()
        soup = BeautifulSoup(html_content, 'lxml')
        boxes = soup.find_all('div', class_='box')

        for box in boxes:
            header = box.find('h2')
            if header and any(keyword in header.get_text(strip=True) for keyword in ['Arrivals', 'Departures']):
                transfer_type = header.get_text(strip=True)
                tbodies = box.find_all('tbody')
                for tbody in tbodies:
                    rows = tbody.find_all('tr', class_=['even', 'odd'])
                    for row in rows:
                        info = row.find_all('td', class_='hauptlink')
                        fee = row.find('td', class_=lambda x: x and 'rechts hauptlink' in x).get_text(strip=True)
                        name = info[0].get_text(strip=True)
                        team = info[1].get_text(strip=True)
                        transfers.append({
                            'name': name,
                            'team': team,
                            'fee': fee,
                            'type': transfer_type
                        })

    return jsonify({
        'squad': squad,
        'transfers': transfers
    })

# comment out when testing
@app.route('/<path:path>')
def send_js(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=False)
