document.addEventListener('DOMContentLoaded', function () {
    const pages = [
        document.getElementById('mainPage'),
        document.getElementById('durationPage'),
        document.getElementById('regionPage'),
        document.getElementById('barrierPage'),
        document.getElementById('selectPage'),
        document.getElementById('planPage'),
        document.getElementById('completionPage')
    ];

    let currentPageIndex = 0;

    // 선택된 항목들을 저장할 객체
    let travelPlan = {
        duration: '',
        region: '',
        barriers: [],
        selectedPlaces: [],
        tripName: ''
        
    };

    const userId = "사용자"; // 예시로 사용자 ID를 "사용자"로 설정, 실제로는 로그인 정보를 사용

    // 페이지 초기화 - 첫 번째 페이지만 보이게 함
    function showPage(index) {
        pages.forEach((page, i) => {
            page.style.display = i === index ? 'block' : 'none';
        });
    }

    // 처음에는 메인 페이지만 보이도록 설정
    showPage(currentPageIndex);

    // next-btn 클릭 시 다음 페이지로 이동
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (currentPageIndex < pages.length - 1) {
                currentPageIndex++;
                showPage(currentPageIndex);
                if (currentPageIndex === 4) {
                    // 4번 페이지: 관광지 리스트 생성
                    generateTouristSpots();
                }
                if (currentPageIndex === 5) {
                    // 5번 페이지: 선택한 관광지 정렬하기
                    generateSortableList();
                    initializeDragEvents(); // 드래그 기능 활성화
                }
                if (currentPageIndex === 6) {
                    // 여행 완료 페이지로 이동 시 여행 이름 설정
                    finalizeTripName();
                }
            }
        });
    });

    // 이전 버튼 클릭 시 이전 페이지로 이동
    document.querySelector('.back-button').addEventListener('click', function () {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            showPage(currentPageIndex);
        }
    });

    // 여행 기간 버튼 클릭 시 이벤트 처리
    const durationButtons = document.querySelectorAll('.duration-btn');
    durationButtons.forEach(button => {
        button.addEventListener('click', function () {
            durationButtons.forEach(btn => {
                btn.style.backgroundColor = '#f9f9f9';
                btn.style.color = '#555';
            });
            this.style.backgroundColor = '#007bff';
            this.style.color = '#ffffff';
            travelPlan.duration = this.textContent;
        });
    });

    // 지역 선택 버튼 클릭 시 이벤트 처리
    const regionButtons = document.querySelectorAll('.region-btn');
    regionButtons.forEach(button => {
        button.addEventListener('click', function () {
            regionButtons.forEach(btn => {
                btn.style.backgroundColor = '#f9f9f9';
                btn.style.color = '#555';
            });
            this.style.backgroundColor = '#007bff';
            this.style.color = '#ffffff';
            travelPlan.region = this.textContent;
        });
    });

    // 무장애 시설 선택 버튼 클릭 시 이벤트 처리
    const barrierButtons = document.querySelectorAll('.barrier-btn');
    barrierButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedBarrier = this.textContent;
            const index = travelPlan.barriers.indexOf(selectedBarrier);
            if (index === -1) {
                travelPlan.barriers.push(selectedBarrier);
                this.style.backgroundColor = '#007bff';
                this.style.color = '#ffffff';
            } else {
                travelPlan.barriers.splice(index, 1);
                this.style.backgroundColor = '#f9f9f9';
                this.style.color = '#555';
            }
        });
    });

    // 4번 페이지: 관광지 리스트 생성
    function generateTouristSpots() {
        const touristSpots = [
            "관광지 1", "관광지 2", "관광지 3", 
            "관광지 4", "관광지 5", "관광지 6"
        ]; // API에서 데이터를 받아오는 로직으로 대체 가능
        const selectBox = document.querySelector('.select-box');
        selectBox.innerHTML = ''; // 기존 항목 초기화
        touristSpots.forEach(spot => {
            const spotElement = document.createElement('div');
            spotElement.classList.add('spot-item');
            spotElement.textContent = spot;

            spotElement.addEventListener('click', function () {
                if (travelPlan.selectedPlaces.includes(spot)) {
                    travelPlan.selectedPlaces = travelPlan.selectedPlaces.filter(item => item !== spot);
                    this.style.backgroundColor = '#f9f9f9';
                    this.style.color = '#555';
                } else {
                    travelPlan.selectedPlaces.push(spot);
                    this.style.backgroundColor = '#007bff';
                    this.style.color = '#ffffff';
                }
            });

            selectBox.appendChild(spotElement);
        });
    }

    // 5번 페이지: 선택한 관광지 목록을 드래그 가능한 리스트로 표시
    function generateSortableList() {
        const sortableList = document.getElementById('sortable');
        sortableList.innerHTML = ''; // 기존 항목 초기화
        travelPlan.selectedPlaces.forEach((place, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.setAttribute('draggable', 'true');
            listItem.innerHTML = `
                <div class="content">
                    <div class="left-info">
                        <div class="icon"><img src="path-to-icon.png" alt="icon"></div>
                        <div>
                            <strong>${index + 1}. ${place}</strong>
                            <p>설명 또는 정보</p>
                        </div>
                    </div>
                    <div class="drag-handle">
                        <img src="path-to-drag-handle.png" alt="drag handle">
                    </div>
                </div>
            `;

            sortableList.appendChild(listItem);
        });

        // 각 항목에 드래그 이벤트를 추가
        initializeDragEvents();
    }

    // 드래그 앤 드롭 기능 활성화
    function initializeDragEvents() {
        let draggedItem = null;

        document.querySelectorAll('.list-item').forEach(item => {
            const dragHandle = item.querySelector('.drag-handle');

            dragHandle.addEventListener('mousedown', function (event) {
                draggedItem = item;
                item.classList.add('dragging');

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(event) {
                if (!draggedItem) return;

                draggedItem.style.position = 'absolute';
                draggedItem.style.top = `${event.clientY - draggedItem.offsetHeight / 2}px`;
                draggedItem.style.left = `${event.clientX - draggedItem.offsetWidth / 2}px`;
            }

            function onMouseUp() {
                if (!draggedItem) return;

                draggedItem.classList.remove('dragging');
                draggedItem.style.position = '';
                draggedItem.style.top = '';
                draggedItem.style.left = '';
                draggedItem = null;

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });
    }

    // 6번 페이지: 여행 이름 설정 및 여행 완료 처리
    function finalizeTripName() {
        const tripNameInput = document.getElementById('tripName').value;
        if (tripNameInput.trim() === "") {
            travelPlan.tripName = `${userId}의 멋진 여행`; // 기본 여행 이름 설정
        } else {
            travelPlan.tripName = tripNameInput;
        }

        // 여행 이름과 정리된 여행 정보를 출력하거나 저장
        console.log('최종 여행 계획:', travelPlan);
    }
});